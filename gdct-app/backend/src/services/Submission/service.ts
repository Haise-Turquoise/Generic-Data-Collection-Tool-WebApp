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
import Submission from '../../types/submission';
import Status from '../../types/status';
import WorkflowProcess from '../../types/workflowprocess';
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
  checkUserRole(userInfo:User, submission:Submission, permission:string[]){
    userInfo.sysRole.forEach(sysRole=>{
      sysRole.org.forEach(org=>{
        org.program.forEach(program=>{
          if(org.orgId.toString() == submission.orgId.toString() && program.programId.toString() == submission.programId.toString()){
            permission.push(sysRole.role)
          }
        })
      })
    })
  }

  async findQuery(query:Partial<Submission>) {
    return await this.submissionRepository.findQuery(query)
  }

  async findReportingPeriod(_id:string){
    const submission = await this.submissionRepository.findById(_id);
    //@ts-ignore
    const submissionPeriod = await this.submissionPeriodRepository.findById(submission.submissionPeriodId);
    //@ts-ignore
    return this.reportingPeriodRepository.findById(submissionPeriod.reportingPeriodId);
  }

  async createSubmissionBaseOnTemplatePackage(submission:any) {
    // Clone the tempalte's workbook data to be used by the user
    return this.programRepository.findById(submission.programId.toString()).then(program => {
      //@ts-ignore
      return this.templateRepository.findById(submission.templateId).then(template => {
        return mastervaluePrepopulation(template.templateData, submission).then(workbook => {
          //@ts-ignore
          return this.templateTypeRepository.findById(template.templateTypeId).then((templateType:any) => {
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

  async uploadSubmissionWorkbook(submission:any, workbookData:Submission['workbookData'], submissionNote:any) {
    //@ts-ignore
    const currentStatus = await this.statusRepository.findOneByID(submission.statusId);
    if (currentStatus.name == 'Approved' || currentStatus.name == 'Submitted') return;
    submission.workbookData = await mastervaluePrepopulation(workbookData, submission);
    submission.updatedDate = new Date();
    submission.parentId = submission.parentId ? submission.parentId : submission._id;

    const submissionNotes = {
      note: submissionNote,
      submissionId: submission.parentId,
      updatedDate: submission.updatedDate,
      role: currentStatus.name,
    };

    return this.submissionRepository.update(submission._id, submission).then(() => {
      //@ts-ignore
      return this.submissionNoteRepository.create(submissionNotes);
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
        const orgConst = { id: org.id, name: org.name };
        return this.programRepository.findById(submission.programId).then(program => {
          const programConst = { _id: program._id, name: program.name };
          //@ts-ignore
          return this.templateRepository.findById(submission.templateId).then(template => {
            const templateConst = { _id: template._id, name: template.name };
            return this.templateTypeRepository
            //@ts-ignore
              .findById(template.templateTypeId)
              //@ts-ignore
              .then(templateType => {
                const templateTypeConst = { _id: templateType._id, name: templateType.name };
                return this.submissionPeriodRepository
                //@ts-ignore
                .findById(submission.submissionPeriodId)
                //@ts-ignore
                .then(submissionPeriod => {
                  return this.reportingPeriodRepository
                  //@ts-ignore
                  .findById(submissionPeriod.reportingPeriodId)
                  //@ts-ignore
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
    return this.submissionRepository.update(submission._id.toString(), submission).then(submission => {
      if (submission.phase === 'Approved') return this.phaseSubmission(submission._id);
    });
  }


  
  async updateStatus(submission:Submission, submissionNote:any, role:string, nextProcessId:string, updatedBy:string) {
    
    const submissionNotes = {
      note: submissionNote,
      submissionId: submission._id,
      updatedDate: new Date(),
      updatedBy,
      role,
    };
    //@ts-ignore
    const currentStatus = await this.statusRepository.findById(ObjectId(submission.statusId));
    if (currentStatus.name == 'Approved') {
      submissionNotes.role = 'Approved';
      //@ts-ignore
      return this.submissionNoteRepository.create(submissionNotes);
    }


    if (role == undefined) {
      submissionNotes.role = currentStatus.name;
      //@ts-ignore
      return this.submissionNoteRepository.create(submissionNotes);
    }
    //@ts-ignore
    await this.submissionNoteRepository.create(submissionNotes);

    const status = await this.statusRepository.findByName(role);

    submission.statusId = status[0].id;
    //@ts-ignore
    submission.workflowProcessId = ObjectId(nextProcessId);
    submission.updatedDate = new Date();

    if (role == 'Submitted') {
      submission.version += 1;
      submission.isLatest = true;
      submission.parentId = submission.parentId ? submission.parentId : submission._id;
      const oldSubmissionId = submission._id.toString();
      await this.submissionRepository.findAndSetFalse(submission._id);
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
    //@ts-ignore
    if (role === 'Approved') submission.approver = updatedBy;

    submission.isLatest = true;

    const newSubmission = this.submissionRepository.update(submission._id.toString(), submission);
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

  async findTemplatePackage(programAndTempTypes:{program:ObjectId, templateTypes:any}[]) {
    const promiseQuery1 :Promise<any>[]= [];
    const newTemplatePackages:TemplatePackage[] = [];
    programAndTempTypes.forEach(element => {
      promiseQuery1.push(
        this.templatePackageRepository.findByProgramId(element.program.toString()).then((templatePackages:any[]) => {
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
                //@ts-ignore
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

  // This is specified one user can only belongs to organization
  async findSubmission(email:any) {
    const userInfo: User = await this.usersRepository.findByEmail(email);
    
    const org = userInfo.sysRole[0].org[0];
    // Update By Sheldon Su in Jan to make it work for admins
    const orgId = org? org.orgId: undefined;
    const programAndTempTypes:{program:ObjectId, templateTypes:any}[] = [];
    const programIds:String[] = [];
    const orgMapping:{[key:string]:string[]} = {};

    // Generate org Mappings to find out which submissions are missing
    if (orgId){
      userInfo.sysRole.forEach(sysRole => {
        sysRole.org.forEach(organization => {
          if (!orgMapping[organization.orgId]) orgMapping[organization.orgId] = [];
          organization.program.forEach(program => {
            orgMapping[organization.orgId].push(String(program.programId));
            if (!programIds.includes(program.programId?.toString())){
              programAndTempTypes.push({ program: program.programId, templateTypes: program.template });
              programIds.push(program.programId?.toString());
            }
          });
        });
      });

    }else{
      const programID:Program[] = await this.programRepository.find({})
      programID.forEach(element=>{programIds.push(element._id?.toString())})
    }
    // Find template packages base on programs and template types
    return this.findTemplatePackage(programAndTempTypes).then((templatePackages:TemplatePackage[]) => {
      const name = 'Unsubmitted';
      const inProgressName ='in progress';
      // Filter out in progress template packages
      return this.statusRepository.findByName(name).then(status => {
        return this.statusRepository.findByName(inProgressName).then(inProgress=>{
          const promiseQuery1 :Promise<any>[]= [];
          templatePackages.forEach(templatePackage => {
            if (templatePackage.statusId.toString() !=inProgress[0]._id.toString())
            promiseQuery1.push(
              this.submissionRepository
                .findByTemplatePackageId(templatePackage._id)
                .then((submissions:Submission[]) => {
                  
                  const newOrgMapping = JSON.parse(JSON.stringify(orgMapping));
                  submissions.forEach(submission => {
                    const orgId = submission.orgId;
                    const programId = submission.programId;
                    if(newOrgMapping[orgId]){
                      newOrgMapping[orgId] = newOrgMapping[orgId].filter((e:ObjectId) => 
                        e.toString() !== programId.toString()
                     );
                     newOrgMapping[orgId] = newOrgMapping[orgId].map((e:ObjectId)=>String(e))
                    }
                  });
                  const { templateIds } = templatePackage;
                  const promiseQuery3 :Promise<any>[]= [];
                  if (templateIds !== undefined) {
                    templateIds.forEach(templateId => {
                      if (templatePackage.programIds !== undefined) {
                        templatePackage.programIds.forEach(programId => {
                          programAndTempTypes.forEach(element => {
                            if (element.program.toString() == programId.toString()) {
                            Object.keys(newOrgMapping).forEach(organizationId=>{
                              if (newOrgMapping[organizationId].includes(String(element.program))){
                                const orgId = organizationId;
                                  promiseQuery3.push(
                                  this.createSubmissionBaseOnTemplatePackage({
                                    orgId,
                                    templateId,
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
            const templatePkgSet = new Map();
            const statusSet = new Map();


            Object.keys(orgMapping).forEach(e=>{
              orgMapping[e] = orgMapping[e].map(id=>String(id));
            })
            //@ts-ignore
            const rawSubmissionArr: Submission[] = await this.submissionRepository.findByOrgIdAndProgramId(Object.keys(orgMapping), programIds);

            // if orgId is undefined, then it must be an admin, so the filter will not filter
            // the submissions
            const submissionArr = orgId? rawSubmissionArr.filter(submission=>{
              return orgMapping[submission.orgId].includes(String(submission.programId))
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
              templateData.forEach((e:TemplatePackage) => {
                templatePkgSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from submissionPeriod repo
            //@ts-ignore
            await this.submissionPeriodRepository.find({_id: {$in: [...periodSet.keys()]}})
            .then(periodData=>{
              periodData.forEach((e:any) => {
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
            submissionArr.forEach(submission => {
              const programData = programSet.get(String(submission.programId));
              const periodName = periodSet.get(String(submission.submissionPeriodId)).name;
              const statusName = statusSet.get(String(submission.statusId)).name;
              const templateData = templatePkgSet.get(String(submission.templatePackageId));

              const permission:string[] = []
              this.checkUserRole(userInfo, submission, permission);
              const changedSubmission : Submission = {
                //@ts-ignore
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
            });

            
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
