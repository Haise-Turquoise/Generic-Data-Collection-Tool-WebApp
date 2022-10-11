import Container from 'typedi';
import SubmissionStatusRepository from '../../repositories/SubmissionStatus'
import TemplateTypeRepository from '../../repositories/TemplateType'
import WorkflowRepository from '../../repositories/Workflow/Workflow';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess/WorkflowProcess';
import RoleWorkflowStatusRepository from '../../repositories/RoleWorkflowStatus/repository';
import StatusRepository from '../../repositories/Status/repository';
import ProgramRepository from '../../repositories/Program/repository';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod/repository';
import TemplateRepository from '../../repositories/Template/repository';
import TemplatePackageRepository from '../../repositories/TemplatePackage/repository';
import SubmissionRepository from '../../repositories/Submission/repository';

import SubmissionStatus from '../../types/submissionstatus';
import TemplateType from '../../types/templatetype';
import WorkflowProcess from '../../types/workflowprocess';
import RoleWorkflowStatus from '../../types/RoleWorkflowStatus';
import Status from '../../types/status';
import Program from '../../types/program';
import Submission from '../../types/submission';
import SubmissionPeriod from '../../types/submissionperiod';
import Template from '../../types/template';
import TemplatePackage from '../../types/templatepackage';
import { ObjectId } from 'mongodb';
import UserSysRole from '../../types/usersysrole';

interface role {
  role: string,
  orgId: string,
  progId: string,
  tempTypeId: string,
}

export default class SubmissionStatusService {
  private submissionStatusRepository: SubmissionStatusRepository;
  private templateTypeRepository: TemplateTypeRepository;
  private workflowProcessRepository: WorkflowProcessRepository;
  private roleWorkflowStatusRepository: RoleWorkflowStatusRepository;
  private statusRepository: StatusRepository;
  private programRepository: ProgramRepository;
  private submissionPeriodRepository: SubmissionPeriodRepository;
  private templateRepository: TemplateRepository;
  private templatePackageRepository: TemplatePackageRepository;
  private submissionRepository: SubmissionRepository;
  private localSearch: (query: Partial<SubmissionStatus>) => Promise<SubmissionStatus[]>

  constructor() {
    this.submissionStatusRepository = Container.get(SubmissionStatusRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.workflowProcessRepository = Container.get(WorkflowProcessRepository);
    this.roleWorkflowStatusRepository = Container.get(RoleWorkflowStatusRepository);
    this.statusRepository = Container.get(StatusRepository);
    this.programRepository = Container.get(ProgramRepository);
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
    this.templateRepository = Container.get(TemplateRepository);
    this.templatePackageRepository = Container.get(TemplatePackageRepository);
    this.submissionRepository = Container.get(SubmissionRepository);
    this.localSearch = async (query: Partial<SubmissionStatus>) => {
      return await this.submissionStatusRepository.find(query)
    }
  }
  
  async findAll() {
    return this.submissionStatusRepository.findAll()
  }

  async findEach() {
    return this.submissionStatusRepository.count()
  }

  async find(query: Partial<SubmissionStatus>) {
    return this.submissionStatusRepository.find(query)
  }

  async createByRoles(roles: UserSysRole[], userId: string) {
    try {
      // needed resources
      const allStatuses: Status[] = await this.statusRepository.findAll()
      const allPrograms: Program[] = await this.programRepository.findAll()
      const allTemplateTypes: TemplateType[] = await this.templateTypeRepository.findAll()
      const allSubmissionPeriods: SubmissionPeriod[] = await this.submissionPeriodRepository.findAll()
      const allTemplates: Template[] = await this.templateRepository.findAll()
      const allWorkflowProcesses: WorkflowProcess[] = await this.workflowProcessRepository.findAll()
      const allRoleWorkflowStatuses: RoleWorkflowStatus[] = await this.roleWorkflowStatusRepository.findAll()
      // map workflowId to first Status -- we'll need this later
      const firstMap: {[key: string]: ObjectId} = {}
      // only create for proper roles
      const filteredRoles: UserSysRole[] = []
      for (let r of roles) {
        const templateType: TemplateType = allTemplateTypes.find(tt => tt._id.toString() === r.templateTypeId.toString())!
        const workflowProcesses: WorkflowProcess[] = allWorkflowProcesses.filter(wp => {
          return wp.workflowId.toString() === templateType.submissionWorkflowId.toString()
        })
        const roleWorkflowStatuses = allRoleWorkflowStatuses.find(rws => rws.role === r.appSysRole)?.workflowStatus || []
        const roleStatuses = allStatuses.filter(s => roleWorkflowStatuses.includes(s.name))
        const roleWPs = workflowProcesses.filter(wp => roleStatuses.find(s => s._id.toString() === wp.statusId.toString()))
        if (roleWPs.length === 0) {
          continue
        }
        // find which process is first, find which process matches current user role
        const first = workflowProcesses.find((process) => {
          // first should have no previous processes
          const prev = workflowProcesses.find((process2) => {
            return process2.to.includes(process._id) && process2._id !== process._id
          })
          return !prev
        })
        if (first) {
          if (!first.to.find(to => roleWPs.find(rwp => rwp._id.toString() === to.toString()))) {
            continue
          }
          firstMap[templateType.submissionWorkflowId.toString()] = first.statusId
        } else {
          console.log('first not found...', templateType.submissionWorkflowId)
        }
        // find process matching current user role TEST OUTPUT
        const workflowStatus: string[] = (await this.roleWorkflowStatusRepository.findByRole(r.appSysRole))?.workflowStatus || []
        const matchingProcesses = workflowProcesses.filter((process) => {
          const procStatus = allStatuses.find((status) => status._id.toString() === process.statusId.toString())
          return workflowStatus.includes(procStatus?.name || '')
        })
        // if current user role status follows first process, role is filtered
        const processesOverlap = !!first?.to.find(procId => matchingProcesses.find(matching => matching._id.toString() === procId.toString()))
        if (processesOverlap) {
          filteredRoles.push(r)
        }
      }
      // now we have roles that have correct position to create new submissions
      // we find submission status entries that match org/program/templateType and create
      let queries: Partial<SubmissionStatus>[] = []
      for (let r of filteredRoles) {
        const program = allPrograms.find(p => p._id.toString() === r.programId.toString())
        const tempType = allTemplateTypes.find(t => t._id.toString() === r.templateTypeId.toString())
        const query = {
          subIndex: null,
          "org.id": +r.organizationId,
          "program.code": program?.code,
          "templateType.name": tempType?.name,
        }
        queries.push(query)
      }
      return this.submissionStatusRepository.findMany(queries).then(async (matchingUnopened: SubmissionStatus[]) => {
        //@ts-ignore
        const newSubmissions: Submission[] = matchingUnopened.map(unopened => {
          const program = allPrograms.find(p => p.name === unopened.program.name)
          // const status = allStatuses.find(s => s.name === unopened.status.name)
          const templateType = allTemplateTypes.find(tt => tt.name === unopened.templateType.name)
          const status = firstMap[templateType?.submissionWorkflowId.toString() || '']
          const subPeriod = allSubmissionPeriods.find(sp => sp.name === unopened.submissionPeriod.name)
          const template = allTemplates.find(t => t.name === unopened.template.name)
          const workflowProcess = allWorkflowProcesses.find(wp => wp._id.toString() === template?.workflowProcessId.toString())
          const workflowId = templateType?.submissionWorkflowId
          // sanity checks - delete if possible
          if (!workflowId) {
            console.log('WHY', workflowProcess, workflowId)
            return
          } else {
            console.log('exists', workflowId)
          }

          
          const submission: Submission = {
            name: `${unopened.org.id}_${unopened.program.name}_${unopened.template.name}_${unopened.submissionPeriod.name}`,
            approved: "false",
            approver: "",
            createdAt: (new Date()),
            isLatest: true,
            isPublished: false,
            orgId: unopened.org.id,
            programId: program!._id,
            statusId: status,
            submissionPeriodId: subPeriod!._id,
            submittedDate: null,
            templateId: template!._id!,
            templateName: unopened.template.name,
            templatePackageId: unopened._id,
            updatedAt: (new Date()),
            updatedBy: new ObjectId(userId),
            updatedDate: (new Date()),
            version: 0,
            workbookData: template?.templateData || [],
            workflowId: workflowId,
            workflowProcessId: template!.workflowProcessId,
          }
          return submission
        })
        await this.submissionRepository.createMany(newSubmissions)
        return true
      })
    } catch (e) {
      console.log('an error occurred creating submissions', e)
      return false
    }
  }
}
