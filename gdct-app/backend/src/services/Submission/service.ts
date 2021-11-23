import Container from 'typedi';
//@ts-ignore
import cloneDeep from 'clone-deep';
import SubmissionRepository from '../../repositories/Submission';
import SubmissionNoteRepository from '../../repositories/SubmissionNote';
import TemplateRepository from '../../repositories/Template';
import StatusRepository from '../../repositories/Status';
import TemplatePackageRepository from '../../repositories/TemplatePackage';
import MasterValueRepository from '../../repositories/MasterValue';
import ProgramRepository from '../../repositories/Program';
import OrgRepository from '../../repositories/Organization';
import TemplateTypeRepository from '../../repositories/TemplateType';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess/WorkflowProcess';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';
import UsersRepository from '../../repositories/Users';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import { mastervalueExtraction } from '../../utils/mastervalue/mastervalueExtraction';
import { mastervaluePrepopulation } from '../../utils/mastervalue/mastervaluePrepopulation';
import {ObjectId} from 'mongodb';

import User ,{UserDoc} from '../../types/user'
import Program, {ProgramDoc} from '../../types/program';
import TemplatePackage from '../../types/templatepackage';
import Submission, { SubmissionPopulated } from '../../types/submission';
import SubmissionNote from '../../types/submissionnote';
import SubmissionPeriod from '../../types/submissionperiod';
import Status from '../../types/status';
import WorkflowProcess from '../../types/workflowprocess';
import TemplateType from '../../types/templatetype';
import Template from '../../types/template';
import AppError from '../../utils/AppError';
import RoleWorkflowStatusRepository from '../../repositories/RoleWorkflowStatus/repository';
// @Service()
export default class SubmissionService {
  private submissionRepository:SubmissionRepository;
  private submissionNoteRepository : SubmissionNoteRepository;
  private templateRepository : TemplateRepository;
  private statusRepository : StatusRepository;
  private templatePackageRepository : TemplatePackageRepository;
  private masterValueRepository : MasterValueRepository;
  private programRepository : ProgramRepository;
  private orgRepository : OrgRepository;
  private templateTypeRepository : TemplateTypeRepository;
  private workflowProcessRepository : WorkflowProcessRepository;
  private submissionPeriodRepository : SubmissionPeriodRepository;
  private usersRepository : UsersRepository;
  private reportingPeriodRepository : ReportingPeriodRepository;
  private roleWorkflowStatusRepository: RoleWorkflowStatusRepository;
  
  constructor() {
    this.submissionRepository = Container.get(SubmissionRepository);
    this.submissionNoteRepository = Container.get(SubmissionNoteRepository);
    this.templateRepository = Container.get(TemplateRepository);
    this.statusRepository = Container.get(StatusRepository);
    this.templatePackageRepository = Container.get(TemplatePackageRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
    this.programRepository = Container.get(ProgramRepository);
    this.orgRepository = Container.get(OrgRepository);
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.workflowProcessRepository = Container.get(WorkflowProcessRepository);
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
    this.usersRepository = Container.get(UsersRepository);
    this.reportingPeriodRepository = Container.get(ReportingPeriodRepository);
    this.roleWorkflowStatusRepository = Container.get(RoleWorkflowStatusRepository);
    // this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
  }

  // checkUserRole(userInfo, submission, permission) {
  //   userInfo.sysRole.forEach(sysRole => {
  //   if (sysRole.org[0]){
  //       sysRole.org[0].program.forEach(program => {
  //         if (
  //           sysRole.org[0].orgId == submission.orgId &&
  //           program.programId.toString() == submission.programId.toString()
  //         ) {
  //           console.log('first case')
  //           permission.push(sysRole.role);
  //         }
  //       });
  //   }
  //   else{
  //     console.log('second case')
  //     permission.push(sysRole.role);
  //   }
  //   });
  //   console.log('permission', permission)
  // }
  async checkUserRole(userInfo:User, submission:Submission, permission:string[]){
    for (const sysRole of userInfo.sysRole){
      for(const org of sysRole.org){
        for (const program of org.program){
          for (const template of program.template){
            const submissionTemplate = await this.templateRepository.findById(submission.templateId)
            const submissionTemplateTypeId = submissionTemplate.templateTypeId
            if(org.orgId.toString() == submission.orgId.toString() && program.programId.toString() == submission.programId.toString()&& submissionTemplateTypeId == template.templateTypeId.toString()){
              permission.push(sysRole.role)
            }
          }
        }
      }
    }
  }

  async findQuery(query: Partial<Submission>) {
    return await this.submissionRepository.findQuery(query)
  }

  async findByRole(role: {orgId: string, progId: string, tempTypeId: string, role: string}) {
    //@ts-ignore
    const submissions: SubmissionPopulated[] = await this.submissionRepository.findQueryPopulate({ orgId: +role.orgId, programId: role.progId })
    // determine acceptable statuses
    const statuses: string[] = (await this.roleWorkflowStatusRepository.findByRole(role.role))?.workflowStatus || []
    const statusIds = []
    for (let status of statuses) {
      const stat = await this.statusRepository.findByName(status)
      if (stat && stat.length > 0) {
        statusIds.push(stat[0]._id)
      }
      // console.log('statuses', statusIds)
    }
    for (let i = 0; i < submissions.length; i++) {
      // workflow processes this user can see, depends on submission workflow
      const workflows: WorkflowProcess[] = await this.workflowProcessRepository.findNeighbors(submissions[i].workflowId.toString(), statusIds.map(id => id.toString()))
      // from available processes -> available statuses
      const statusRes = []
      for (let workflowProcess of workflows) {
        const stat = await this.statusRepository.findById(workflowProcess.statusId)
        if (stat) {
          statusRes.push(stat.name)
        }
      }
      const tempTypeId = (await this.templateRepository.findById(submissions[i].templateId)).templateTypeId
      if (tempTypeId.toString() !== role.tempTypeId.toString() || !statusRes.includes(submissions[i].statusId.name)) {
        submissions.splice(i,1)
      }
    }
    return submissions
  }

  async createSubmissions(submissions: Submission[]) {
    this.submissionRepository.createMany(submissions)
  }

  async findReportingPeriod(_id:string){
    const submission = await this.submissionRepository.findById(_id);
    
    const submissionPeriod = await this.submissionPeriodRepository.findById(submission.submissionPeriodId);
    
    return this.reportingPeriodRepository.findById(submissionPeriod.reportingPeriodId);
  }

  async createSubmissionBaseOnTemplatePackage(submission:any) {
    // Clone the tempalte's workbook data to be used by the user
    return this.programRepository.findById(submission.programId).then(program => {
      
      return this.templateRepository.findById(submission.templateId).then(template => {
        return mastervaluePrepopulation(template.templateData, submission).then(workbook => {
          
          return this.templateTypeRepository.findById(template.templateTypeId).then((templateType:TemplateType) => {
            return this.workflowProcessRepository
              .find({ workflowId: templateType.submissionWorkflowId })
              .then((workflowProcesses:WorkflowProcess[]) => {
                const nodes = new Set();
  
                const visitedNodes = new Set();
  
                workflowProcesses.forEach(({ _id, to }) => {
                  nodes.add(_id.toString());
                  to.forEach(outNodeIds => {
                    visitedNodes.add(outNodeIds.toString());
                    nodes.add(outNodeIds.toString());
                  });
                });

                template.templateData = workbook;
        
                let initialNode = null;
  
                nodes.forEach(node => {
                  if (!visitedNodes.has(node)) {
                    initialNode = node;
                  }
                });
                if (!program || !template) throw new AppError(`Cannot find template or program`);
                
                submission.name = submission.orgId
                  .toString()
                  .concat('_', program.name, '_', template.name);
                submission.workflowProcessId = initialNode;
                submission.workbookData = template.templateData;
                submission.templateName = template.name;
                submission.workflowId = templateType.submissionWorkflowId;
                
                return this.submissionRepository.create(submission);
              });
          });
        })
      });
    });
  }

  async uploadSubmissionWorkbook(submission:any, workbookData:Submission['workbookData'], submissionNote:SubmissionNote) {
    //@ts-ignore
    const currentStatus = await this.statusRepository.findById(submission.statusId);
    if (!currentStatus) throw new AppError(`Cannot find status with Id : ${submission.statusId}`); 
    if (currentStatus.name == 'Approved' || currentStatus.name == 'Submitted') return;
    submission.workbookData = await mastervaluePrepopulation(workbookData, submission);
    submission.updatedDate = new Date();
    submission.parentId = submission.parentId ? submission.parentId : submission._id;

    const submissionNotes :any= {
      note: submissionNote,
      submissionId: submission.parentId,
      updatedDate: submission.updatedDate,
      role: currentStatus.name,
    };

    return this.submissionRepository.update(submission._id, submission).then(() => {
      if (submissionNotes.note) return this.submissionNoteRepository.create(submissionNotes);
    });
  }

  async findSubmissionById(id:string) {
    return this.submissionRepository.findById(id);
  }
  async findSubmissionByParentId(parentId:string) {
    return this.submissionRepository.findByParentId(parentId);
  }

  async findProgramById(id:string) {
    return this.programRepository.findById(id);
  }

  // 
  async phaseSubmission(id:string) {
    return this.findSubmissionById(id).then(submission => {
      if (!submission) throw 'Submission id does not exist';
      return this.orgRepository.findById(submission.orgId).then(org => {
        if (!org) throw new AppError(`Cannot find org with orgId: ${submission.orgId}`);
        const orgConst = { id: org.id, name: org.name };
        return this.programRepository.findById(submission.programId).then(program => {
          if (!program) throw new AppError(`Cannot find program with orgId: ${submission.programId}`);
          const programConst = { _id: program._id, name: program.name };
          return this.templateRepository.findById(submission.templateId).then(template => {
            const templateConst = template.name;
            return this.templateTypeRepository
            
              .findById(template.templateTypeId)
              
              .then(templateType => {
                const templateTypeConst = { _id: templateType._id, name: templateType.name };
                return this.submissionPeriodRepository
                
                .findById(submission.submissionPeriodId)
                
                .then(submissionPeriod => {
                  return this.reportingPeriodRepository
                  
                  .findById(submissionPeriod.reportingPeriodId)
                  
                  .then(reportingPeriod => {
                    const reportingPeriodConst = { name: reportingPeriod.name };
                    mastervalueExtraction(
                      id,
                      submission,
                      orgConst,
                      programConst,
                      templateConst,
                      templateTypeConst,
                      reportingPeriodConst,
                    );
                  }) 
                })
              });
          });
        });
      });
    });
  }

  async deleteSubmission(id:string) {
    return this.submissionRepository.delete(id);
  }

  async updateSubmission(submission:Submission) {
    return this.submissionRepository.update(submission._id!.toString(), submission).then(submission => {
      //@ts-ignore
      if (submission.phase === 'Approved') return this.phaseSubmission(String(submission._id));
    });
  }


  
  async updateStatus(submission:Submission, submissionNote:SubmissionNote, role:string, nextProcessId:string, updatedBy:string) {
    const submissionNotes :any= {
      note: submissionNote,
      submissionId: submission._id,
      updatedDate: new Date(),
      updatedBy,
      role,
    };
    const currentStatus = await this.statusRepository.findById(new ObjectId(submission.statusId));
    if (!currentStatus) throw new AppError(`Cannot find status by id ${submission.statusId}`);
    
    if (currentStatus.name == 'Approved') {
      submissionNotes.role = 'Approved';
      
      await this.submissionNoteRepository.create(submissionNotes);
      return submission
    }


    if (role == undefined) {
      submissionNotes.role = currentStatus.name;
      
      await this.submissionNoteRepository.create(submissionNotes);
      return submission
    }
  
    await this.submissionNoteRepository.create(submissionNotes);

    const status = await this.statusRepository.findByName(role);

    submission.statusId = status[0].id;
  
    submission.workflowProcessId = new ObjectId(nextProcessId);
    submission.updatedDate = new Date();

    if (role == 'Submitted') {
      submission.version += 1;
      submission.isLatest = true;
      submission.parentId = submission.parentId ? submission.parentId : submission._id;
      const oldSubmissionId = submission._id!.toString();
      await this.submissionRepository.findAndSetFalse(submission._id!);
      //@ts-ignore
      delete submission._id;
      const newSubmission = await this.submissionRepository.create(submission);

      await this.submissionNoteRepository.updateNoteToNewSubmission(oldSubmissionId, newSubmission._id.toString());
      return newSubmission;

      // return this.submissionRepository.findAndSetFalse(submission._id).then(async() => {
      //   delete submission._id;
      //   const newSubmission = await this.submissionRepository.create(submission);

      //   await this.submissionNoteRepository.updateNoteToNewSubmission(oldSubmissionId, newSubmission._id);
      //   return newSubmission;
      // });
    }
    
    if (role === 'Approved') submission.approver = updatedBy;

    submission.isLatest = true;

    const newSubmission = await this.submissionRepository.update(submission._id!.toString(), submission);
    //@ts-ignore
    if (role === 'Approved') this.phaseSubmission(newSubmission._id);

    return newSubmission;

    // return this.statusRepository.findByName(role).then(status => {
    //   submission.statusId = status[0].id;
    //   submission.workflowProcessId = nextProcessId;
    //   submission.updatedDate = new Date();

    //   if (role == 'Submitted') {
    //     submission.version += 1;
    //     submission.isLatest = true;
    //     submission.parentId = submission.parentId ? submission.parentId : submission._id;
    //     const oldSubmissionId = submission._id;
    //     return this.submissionRepository.findAndSetFalse(submission._id).then(async() => {
    //       delete submission._id;
    //       const newSubmission = await this.submissionRepository.create(submission);

    //       await this.submissionNoteRepository.updateNoteToNewSubmission(oldSubmissionId, newSubmission._id);
    //       return newSubmission;
    //     });
    //   }
    //   if (role === 'Approved') submission.approver = updatedBy;
    //   submission.isLatest = true;
    //   return this.submissionRepository.update(submission._id, submission).then(submission => {
    //     if (role === 'Approved') return this.phaseSubmission(submission._id);
    //   });
    // });
  }


  async findTempPkg(programAndTempTypes:{program:ObjectId, templateTypes:any[]}[]){
    const program2TypesMap = new Map<string, string[]>();

    programAndTempTypes.forEach(e=>{
      console.log(e.templateTypes.map(type=>String(type.templateTypeId)))
      program2TypesMap.set(String(e.program), e.templateTypes.map(type=>String(type.templateTypeId)))
    })
    const packages:any[] = await this.templatePackageRepository
    //@ts-ignore
    .retrieveFullPkgInfoByProgramId(programAndTempTypes.map(e=>e.program));

    console.log(program2TypesMap);

    const filteredPackage = packages.filter(templatePkg=>{
      for (const temlpate of templatePkg.templateIds){
        const templateTypeId = String(temlpate.templateTypeId)
        for (const program of templatePkg.programIds){
          if (program2TypesMap.get(String(program))!.includes(templateTypeId)){
            console.log(String(program), templateTypeId)
            return true;
          }
        }
      }
      return false;
    });
    return filteredPackage;
  }

  // This function is not in use anymore, just in case it will be use in the future,
  // I will leave it here for now
  async findTemplatePackage(programAndTempTypes:{program:ObjectId, templateTypes:any[]}[]) {
    const promiseQuery1 :Promise<any>[]= [];
    const newTemplatePackages:TemplatePackage[] = [];
    programAndTempTypes.forEach(element => {
      promiseQuery1.push(
        this.templatePackageRepository.findByProgramId(element.program.toString()).then((templatePackages:TemplatePackage[]) => {
          const templatePackagesCopy:any[] = [];
          
          templatePackages.forEach(templatePackage => {
            templatePackagesCopy.filter(ele => ele._id !== templatePackage._id);
            templatePackagesCopy.push(templatePackage);
          });
          const promiseQuery3 :Promise<any>[]= [];
          templatePackagesCopy.forEach(templatePackage => {
            const promiseQuery2 :Promise<any>[]= [];
            const newTempPackage = {
              ...templatePackage._doc,
              templateIds: [],
            };
            templatePackage.templateIds.forEach((templateId:string) => {
              promiseQuery2.push(
                
                this.templateRepository.findById(templateId).then(template => {
                  if (
                    element.templateTypes.find(
                      (templateType:any) =>
                        templateType.templateTypeId.toString() ===
                        template.templateTypeId.toString(),
                    ) !== undefined
                  ) {
                    newTempPackage.templateIds.push(templateId);
                  }
                }),
              );
            });
            promiseQuery3.push(
              Promise.all(promiseQuery2).then(() => {
                if (newTempPackage.templateIds.length !== 0) {
                  newTemplatePackages.push(newTempPackage);
                }
              }),
            );
          });

          return Promise.all(promiseQuery3);
        }),
      );
    });

    return Promise.all(promiseQuery1).then(() => {
      
      const uniqueNewTemplatePackages :TemplatePackage[]= [];
      newTemplatePackages.forEach(newTemplatePackage => {
       
        let duplicate = false;
        uniqueNewTemplatePackages.forEach(ele => {
          if (JSON.stringify(ele._id) == JSON.stringify(newTemplatePackage._id)) {
            duplicate = true;
          }
        });
        
        if (!duplicate) {
          uniqueNewTemplatePackages.push(newTemplatePackage);
        }
      });
      return uniqueNewTemplatePackages;
    });
  }

 
  async findSubmission(email:any) {
    const userInfo: User = await this.usersRepository.findByEmail(email) as User;
    
    const org = userInfo.sysRole[0].org[0];
    // Update By Sheldon Su in Jan to make it work for admins
    const orgId = org? org.orgId: undefined;
    const programAndTempTypes:{program:ObjectId, 
      templateTypes:{
        templateTypeId: ObjectId;
        templateCode: string;
        status: string;
      }[]
  }[] = [];
    const programIds:String[] = [];
    const orgProgramMapping:{[key:string]:string[]} = {};
    const orgTempTypeMapping:{[key:string]:string[]} = {}
    // Generate org Mappings to find out which submissions are missing
    if (orgId){
      userInfo.sysRole.forEach(sysRole => {
        sysRole.org.forEach(organization => {

          if (!orgProgramMapping[organization.orgId]) orgProgramMapping[organization.orgId] = [];
          if (!orgTempTypeMapping[organization.orgId]) orgTempTypeMapping[organization.orgId] = [];

          organization.program.forEach(program => {
            orgProgramMapping[organization.orgId].push(String(program.programId));
            
            if (!programIds.includes(String(program.programId))){
              programAndTempTypes.push({ program: program.programId, templateTypes: program.template });
              programIds.push(String(program.programId));
            }else{
              const targetObject = programAndTempTypes.filter(e=>String(e.program) === String(program.programId))[0];
              program.template.forEach(typeId=>{
                targetObject.templateTypes.push(typeId);
              })
            }
            program.template.forEach(typeObject=>{
              if (!orgTempTypeMapping[organization.orgId].includes(String(typeObject.templateTypeId))){
                orgTempTypeMapping[organization.orgId].push(String(typeObject.templateTypeId));
              }
            })
          });
        });
      });

    }else{
      const programID:Program[] = await this.programRepository.find({})
      programID.forEach(element=>{programIds.push(element._id?.toString())})
    }
    // Find template packages base on programs and template types
    return this.findTempPkg(programAndTempTypes).then((templatePackages:TemplatePackage[]) => {
      const name = 'Unsubmitted';
      const inProgressName ='in progress';
      // Filter out in progress template packages

      return this.statusRepository.findByName(name).then(status => {
        return this.statusRepository.findByName(inProgressName).then(inProgress=>{
          const promiseQuery1 :Promise<any>[]= [];
          templatePackages.forEach((templatePackage:any) => {
            if (templatePackage.statusId.toString() != inProgress[0]._id.toString())
            promiseQuery1.push(
              this.submissionRepository
                .findByTemplatePackageId(templatePackage._id)
                .then((submissions:Submission[]) => {
                  const newOrgMapping = JSON.parse(JSON.stringify(orgProgramMapping));
                  const newTempTypeMapping = JSON.parse(JSON.stringify(orgTempTypeMapping));
                  submissions.forEach(submission => {
                    const orgId = submission.orgId;
                    const programId = submission.programId;
                    if(newOrgMapping[orgId] && newTempTypeMapping[orgId]){
                      newTempTypeMapping[orgId] = newTempTypeMapping[orgId].filter((e:ObjectId) => 
                        String(e) !== String(templatePackage.templateIds[0].templateTypeId)
                      );
                      if(newTempTypeMapping[orgId].length === 0 ){
                        newOrgMapping[orgId] = newOrgMapping[orgId].filter((e:ObjectId) => 
                        String(e) !== String(programId)
                       );
                       newOrgMapping[orgId] = newOrgMapping[orgId].map((e:ObjectId)=>String(e))
                      }
                    }
                  });
                  const { templateIds } = templatePackage;
                  const promiseQuery3:Promise<any>[]= [];
                  
                  if (templateIds !== undefined) {
                    
                    templateIds.forEach((templateObj: any) => {
                      if (templatePackage.programIds !== undefined) {
                        
                        templatePackage.programIds.forEach((programId:any) => {
                          programAndTempTypes.forEach(element => {
                            if (element.program.toString() == programId.toString()) {
                            
                              Object.keys(newOrgMapping).forEach(organizationId=>{
                               
                                if (newOrgMapping[organizationId].includes(String(element.program)) && 
                                    newTempTypeMapping[organizationId].includes(String(templateObj.templateTypeId))){
                                 
                                  const orgId = organizationId;

                                    promiseQuery3.push(
                                    this.createSubmissionBaseOnTemplatePackage({
                                      orgId,
                                      templateId:templateObj._id,
                                      templatePackageId: templatePackage._id,
                                      submissionPeriodId: templatePackage.submissionPeriodId,
                                      programId,
                                      statusId: status[0]._id,
                                      version: 0,
                                      isLatest: true,
                                    }),
                                  );
                                }
                              });
                            }
                          });
                        });
                      }
                    });
                    // console.log(promiseQuery3)
                    // count+=1;
                    return Promise.all(promiseQuery3);

                    // return Promise.all(promiseQuery3);
                  }
                  
                }),
            );
          });
          return Promise.all(promiseQuery1).then(async () => {
            const changedSubmissions:Submission[] = [];

            // Generate all the maps
            const periodSet = new Map();
            const programSet = new Map();
            const templatePkgSet = new Map<any, any>();
            const statusSet = new Map();


            Object.keys(orgProgramMapping).forEach(e=>{
              orgProgramMapping[e] = orgProgramMapping[e].map(id=>String(id));
            })
            //@ts-ignore
            const rawSubmissionArr: Submission[] = await this.submissionRepository.findByOrgIdAndProgramId(Object.keys(orgProgramMapping), programIds);

            // if orgId is undefined, then it must be an admin, so the filter will not filter
            // the submissions
            const submissionArr = orgId? rawSubmissionArr.filter(submission=>{
              return orgProgramMapping[submission.orgId].includes(String(submission.programId))
            }
            ) : rawSubmissionArr;
            

            // Generate a the sets of look up tables to prevent dupllicate entries and provide
            // ease of access later in the code
            submissionArr.forEach(submission => {
              const submissionPeriodId = String(submission.submissionPeriodId);
              const programId = String(submission.programId);
              const templatePackageId = String(submission.templatePackageId);
              const statusId = String(submission.statusId)
              //@ts-ignore
              if (!periodSet.has(submissionPeriodId)) periodSet.set(submissionPeriodId);
              //@ts-ignore
              if (!programSet.has(programId)) programSet.set(programId);
              //@ts-ignore
              if (!templatePkgSet.has(templatePackageId)) templatePkgSet.set(templatePackageId);
              //@ts-ignore
              if (!statusSet.has(statusId)) statusSet.set(statusId);
            });
            
            // Retrieve related data from templatePkg repo
            //@ts-ignore
            await this.templatePackageRepository.find({_id: {$in: [...templatePkgSet.keys()]}})
            .then(templateData=>{
              //@ts-ignore
              templateData.forEach((e:TemplatePackage) => {
                templatePkgSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from submissionPeriod repo
            //@ts-ignore
            await this.submissionPeriodRepository.find({_id: {$in: [...periodSet.keys()]}})
            .then(periodData=>{
              periodData.forEach((e:SubmissionPeriod) => {
                periodSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from programRepository repo
            //@ts-ignore
            await this.programRepository.find({_id: {$in: [...programSet.keys()]}})
            .then(programData=>{
              programData.forEach((e:Program) => {
                programSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from status repo
            //@ts-ignore
            await this.statusRepository.find({_id: {$in: [...statusSet.keys()]}})
            .then(statusData=>{
              statusData.forEach((e:Status) => {
                statusSet.set(String(e._id), e);
              });
            });
            
            // Assemble each the object for transfer
            for (const submission of submissionArr){
              const programData = programSet.get(String(submission.programId));
              const periodName = periodSet.get(String(submission.submissionPeriodId)).name;
              const statusName = statusSet.get(String(submission.statusId)).name;
              const templateData = templatePkgSet.get(String(submission.templatePackageId));
              const permission:string[] = []
              await this.checkUserRole(userInfo, submission, permission);
              const changedSubmission : Submission = {
                
                ...submission._doc,
                programName: programData.name,
                programId: programData._id,
                period: periodName,
                phase: statusName,
                permission,
                parentId: submission.parentId
                  ? submission.parentId
                  : submission._id,
                templatePackageName: templateData.name,
              };

              changedSubmissions.push(changedSubmission)
            };

            
            return changedSubmissions

            /* Note the below code is a faster implementation at small scale, but might not scale well (not sure)
            * It uses mongoDB's pipeline to reduce complexity, but it might be resouce
            * intensive when there are a lot of submissions*/

            // const orgIds = Object.keys(orgMapping).map(id=>Number(id));
            // return this.submissionRepository.fetchAllInfo(orgIds, programIds).then(data=>{
            //   data.forEach(submission=>{
            //     const permission = [];
            //     this.checkUserRole(userInfo, submission, permission);
            //     const submissionData = {
            //       ...submission,
            //       permission,
            //       programName: submission.program.name,
            //       programId: submission.program._id,
            //       period: submission.submissionPeriod.name,
            //       phase: submission.status.name,
            //       parentId: submission.parentId
            //         ? submission.parentId
            //         : submission._id,
            //       templatePackageName: submission.templatePackage.name,
            //     }
            //     delete submissionData.templatePackage;
            //     delete submissionData.submissionPeriod;
            //     delete submissionData.program;
            //     delete submissionData.status;
            //     changedSubmissions.push(submissionData);
            //   });
            //   return changedSubmissions;
            // });
            //-------------------------------------------------------------------------------------------------
          });
        });

      });
    });
  }
}
