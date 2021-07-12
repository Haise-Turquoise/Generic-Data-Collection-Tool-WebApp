import Container from 'typedi';
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

// @Service()
export default class SubmissionService {
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
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
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
  checkUserRole(userInfo, submission, permission){
    userInfo.sysRole.forEach(sysRole=>{
      sysRole.org.forEach(org=>{
        org.program.forEach(program=>{
          if(org.orgId == submission.orgId && program.programId.toString() == submission.programId.toString()){
            permission.push(sysRole.role)
          }
        })
      })
    })
  }

  async findReportingPeriod(_id){
    const submission = await this.submissionRepository.findById(_id);
    const submissionPeriod = await this.submissionPeriodRepository.findById(submission.submissionPeriodId);
    return this.reportingPeriodRepository.findById(submissionPeriod.reportingPeriodId);
  }

  async createSubmissionBaseOnTemplatePackage(submission) {
    // Clone the tempalte's workbook data to be used by the user
    return this.programRepository.findById(submission.programId).then(program => {
      return this.templateRepository.findById(submission.templateId).then(template => {
        return mastervaluePrepopulation(template.templateData, submission).then(workbook => {
          return this.templateTypeRepository.findById(template.templateTypeId).then(templateType => {
            return this.workflowProcessRepository
              .find({ workflowId: templateType.submissionWorkflowId })
              .then(workflowProcesses => {
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

  async uploadSubmissionWorkbook(submission, workbookData, submissionNote) {
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
      return this.submissionNoteRepository.create(submissionNotes);
    });
  }

  async findSubmissionById(id) {
    return this.submissionRepository.findById(id);
  }
  async findSubmissionByParentId(parentId) {
    return this.submissionRepository.findByParentId(parentId);
  }

  async findProgramById(id) {
    return this.programRepository.findById(id);
  }

  // 
  async phaseSubmission(id) {
    return this.findSubmissionById(id).then(submission => {
      if (!submission) throw 'Submission id does not exist';
      return this.orgRepository.findById(submission.orgId).then(org => {
        const orgConst = { id: org.id, name: org.name };
        return this.programRepository.findById(submission.programId).then(program => {
          const programConst = { _id: program._id, name: program.name };
          return this.templateRepository.findById(submission.templateId).then(template => {
            const templateConst = { _id: template._id, name: template.name };
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

  async deleteSubmission(id) {
    return this.submissionRepository.delete(id);
  }

  async updateSubmission(submission) {
    return this.submissionRepository.update(submission._id, submission).then(submission => {
      if (submission.phase === 'Approved') return this.phaseSubmission(submission._id);
    });
  }


  
  async updateStatus(submission, submissionNote, role, nextProcessId, updatedBy) {
    
    const submissionNotes = {
      note: submissionNote,
      submissionId: submission._id,
      updatedDate: new Date(),
      updatedBy,
      role,
    };
    const currentStatus = await this.statusRepository.findById(ObjectId(submission.statusId));
    if (currentStatus.name == 'Approved') {
      submissionNotes.role = 'Approved';
      return this.submissionNoteRepository.create(submissionNotes);
    }


    if (role == undefined) {
      submissionNotes.role = currentStatus.name;
      return this.submissionNoteRepository.create(submissionNotes);
    }
    await this.submissionNoteRepository.create(submissionNotes);

    const status = await this.statusRepository.findByName(role);

    submission.statusId = status[0].id;
    submission.workflowProcessId = nextProcessId;
    submission.updatedDate = new Date();

    if (role == 'Submitted') {
      submission.version += 1;
      submission.isLatest = true;
      submission.parentId = submission.parentId ? submission.parentId : submission._id;
      const oldSubmissionId = submission._id;
      await this.submissionRepository.findAndSetFalse(submission._id);

      delete submission._id;
        const newSubmission = await this.submissionRepository.create(submission);

        await this.submissionNoteRepository.updateNoteToNewSubmission(oldSubmissionId, newSubmission._id);
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

    const newSubmission = this.submissionRepository.update(submission._id, submission);
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

  async findTemplatePackage(programAndTempTypes) {
    const promiseQuery1 = [];
    const newTemplatePackages = [];
    programAndTempTypes.forEach(element => {
      promiseQuery1.push(
        this.templatePackageRepository.findByProgramId(element.program).then(templatePackages => {
          const templatePackagesCopy = [];
          templatePackages.forEach(templatePackage => {
            templatePackagesCopy.filter(ele => ele._id !== templatePackage._id);
            templatePackagesCopy.push(templatePackage);
          });
          const promiseQuery3 = [];
          templatePackagesCopy.forEach(templatePackage => {
            const promiseQuery2 = [];
            const newTempPackage = {
              ...templatePackage._doc,
              templateIds: [],
            };
            templatePackage.templateIds.forEach(templateId => {
              promiseQuery2.push(
                this.templateRepository.findById(templateId).then(template => {
                  if (
                    element.templateTypes.find(
                      templateType =>
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
      
      const uniqueNewTemplatePackages = [];
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
  async findSubmission(email) {
    const userInfo = await this.usersRepository.findByEmail(email);
    
    const org = userInfo.sysRole[0].org[0];
    // Update By Sheldon Su in Jan to make it work for admins
    const orgId = org? org.orgId: undefined;
    const programAndTempTypes = [];
    const programIds = [];
    const orgMapping = {};

    // Generate org Mappings to find out which submissions are missing
    if (orgId){
      userInfo.sysRole.forEach(sysRole => {
        sysRole.org.forEach(organization => {
          if (!orgMapping[organization.orgId]) orgMapping[organization.orgId] = [];
          organization.program.forEach(program => {
            orgMapping[organization.orgId].push(String(program.programId));
            if (!programIds.includes(program.programId)){
              programAndTempTypes.push({ program: program.programId, templateTypes: program.template });
              programIds.push(program.programId);
            }
          });
        });
      });

    }else{
      const programID = await this.programRepository.find({})
      programID.forEach(element=>{programIds.push(element._id)})
    }
    // Find template packages base on programs and template types
    return this.findTemplatePackage(programAndTempTypes).then(templatePackages => {
      const name = 'Unsubmitted';
      const inProgressName ='in progress';
      // Filter out in progress template packages
      return this.statusRepository.findByName(name).then(status => {
        return this.statusRepository.findByName(inProgressName).then(inProgress=>{
          const promiseQuery1 = [];
          templatePackages.forEach(templatePackage => {
            if (templatePackage.statusId.toString() !=inProgress[0]._id.toString())
            promiseQuery1.push(
              this.submissionRepository
                .findByTemplatePackageId(templatePackage._id)
                .then(submissions => {
                  
                  const newOrgMapping = JSON.parse(JSON.stringify(orgMapping));
                  submissions.forEach(submission => {
                    const orgId = submission.orgId;
                    const programId = submission.programId;
                    if(newOrgMapping[orgId]){
                      newOrgMapping[orgId] = newOrgMapping[orgId].filter(e => 
                        e.toString() !== programId.toString()
                     );
                     newOrgMapping[orgId] = newOrgMapping[orgId].map(e=>String(e))
                    }
                  });
                  const { templateIds } = templatePackage;
                  const promiseQuery3 = [];
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
            const changedSubmissions = [];

            // Generate all the maps
            const periodSet = new Map();
            const programSet = new Map();
            const templatePkgSet = new Map();
            const statusSet = new Map();


            Object.keys(orgMapping).forEach(e=>{
              orgMapping[e] = orgMapping[e].map(id=>String(id));
            })

            const rawSubmissionArr = await this.submissionRepository.findByOrgIdAndProgramId(Object.keys(orgMapping), programIds);

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

              if (!periodSet.has(submissionPeriodId)) periodSet.set(submissionPeriodId);
              if (!programSet.has(programId)) programSet.set(programId);
              if (!templatePkgSet.has(templatePackageId)) templatePkgSet.set(templatePackageId);
              if (!statusSet.has(statusId)) statusSet.set(statusId);
            });
            
            // Retrieve related data from templatePkg repo
            await this.templatePackageRepository.find({_id: {$in: [...templatePkgSet.keys()]}})
            .then(templateData=>{
              templateData.forEach(e => {
                templatePkgSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from submissionPeriod repo
            await this.submissionPeriodRepository.find({_id: {$in: [...periodSet.keys()]}})
            .then(periodData=>{
              periodData.forEach(e => {
                periodSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from programRepository repo
            await this.programRepository.find({_id: {$in: [...programSet.keys()]}})
            .then(programData=>{
              programData.forEach(e => {
                programSet.set(String(e._id), e);
              });
            });

            // Retrieve related data from status repo
            await this.statusRepository.find({_id: {$in: [...statusSet.keys()]}})
            .then(statusData=>{
              statusData.forEach(e => {
                statusSet.set(String(e._id), e);
              });
            });
            
            // Assemble each the object for transfer
            submissionArr.forEach(submission => {
              const programData = programSet.get(String(submission.programId));
              const periodName = periodSet.get(String(submission.submissionPeriodId)).name;
              const statusName = statusSet.get(String(submission.statusId)).name;
              const templateData = templatePkgSet.get(String(submission.templatePackageId));

              const permission = []
              this.checkUserRole(userInfo, submission, permission);
              const changedSubmission = {
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
