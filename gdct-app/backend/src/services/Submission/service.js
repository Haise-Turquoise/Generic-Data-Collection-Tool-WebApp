import Container from 'typedi';
import pako from 'pako'
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
import WorkflowProcessRepository from '../../repositories/WorkflowProcess';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';
import UsersRepository from '../../repositories/Users';
import GoogleSheetRepository from '../../repositories/GoogleSheet';
import { createSpreadsheet, addEditor } from '../../middlewares/googleapis/request'
import { saveGoogleSheetInSubmission }from '../../middlewares/googleapis/save'
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import { mastervalueExtraction } from '../../utils/mastervalue/mastervalueExtraction';
import { mastervaluePrepopulation } from '../../utils/mastervalue/mastervaluePrepopulation'
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

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
    this.googleSheetRepository = Container.get(GoogleSheetRepository)
    this.reportingPeriodRepository = Container.get(ReportingPeriodRepository);
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
  }

  checkUserRole(userInfo, submission, permission) {
    userInfo[0].sysRole.forEach(sysRole => {
      sysRole.org[0].program.forEach(program => {
        if (
          sysRole.org[0].orgId == submission.orgId &&
          program.programId.toString() == submission.programId.toString()
        ) {
          permission.push(sysRole.role);
        }
      });
    });
  }

  async createSubmissionBaseOnTemplatePackage(submission) {
    // Clone the tempalte's workbook data to be used by the user
    return this.programRepository.findById(submission.programId).then(program => {
      return this.templateRepository.findById(submission.templateId).then(template => {
        return mastervaluePrepopulation(template.templateData).then(workbook => {
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
                submission.workbookData = {
                  name: submission.orgId,
                  data: template.templateData,
                }

                submission.workflowId = templateType.submissionWorkflowId;
                
                return this.submissionRepository.create(submission);
              });
          });
        })
      });
    });
  }

  async uploadSubmissionWorkbook(submission, workbookData, submissionNote) {
    const currentStatus = await this.statusRepository.findById(submission.statusId);
    if (currentStatus.name == 'Approved' || currentStatus.name == 'Submitted') return;

    submission.workbookData = workbookData;
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

  async findProgramById(id) {
    return this.programRepository.findById(id);
  }

  // 
  async phaseSubmission(id) {
    return this.findSubmissionById(id).then(submission => {
      if (!submission) throw 'Submission id does not exist';
      return this.orgRepository.findById(submission.orgId).then(org => {
        const orgConst = { id: org[0].id, name: org[0].name };
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

  async updateStatus(submission, submissionNote, role, nextProcessId) {
    const newSubmission = await this.submissionRepository.findById(submission._id);
    if (newSubmission.googleSheetId){
      await Promise.resolve(saveGoogleSheetInSubmission(newSubmission.googleSheetId));
      submission = await this.submissionRepository.findById(submission._id);
    }

    const submissionNotes = {
      note: submissionNote,
      submissionId: submission.parentId ? submission.parentId : submission._id,
      updatedDate: new Date(),
      role,
    };

    const currentStatus = await this.statusRepository.findById(submission.statusId);
    if (currentStatus.name == 'Approved') {
      submissionNotes.role = 'Approved';
      return this.submissionNoteRepository.create(submissionNotes);
    }

    if (role == undefined) {
      submissionNotes.role = currentStatus.name;
      return this.submissionNoteRepository.create(submissionNotes);
    }
    await this.submissionNoteRepository.create(submissionNotes);

    return this.statusRepository.findByName(role).then(status => {
      submission.statusId = status[0].id;
      submission.workflowProcessId = nextProcessId;
      submission.updatedDate = new Date();

      if (role == 'Submitted') {
        submission.version += 1;
        submission.isLatest = true;
        submission.parentId = submission.parentId ? submission.parentId : submission._id;
        return this.submissionRepository.findAndSetFalse(submission._id).then(() => {
          delete submission._id;
          return this.submissionRepository.create(submission);
        });
      }
      submission.isLatest = true;
      return this.submissionRepository.update(submission._id, submission).then(submission => {
        if (role === 'Approved') return this.phaseSubmission(submission._id);
      });
    });
  }

  async findTemplatePackage(programAndTempTypes) {
    const promiseQuery1 = [];
    const newTemplatePackages = [];
    programAndTempTypes.forEach(element => {
      promiseQuery1.push(
        this.templatePackageRepository.findByProgramId(element.program).then(templatePackages => {
          const promiseQuery3 = [];
          templatePackages.forEach(templatePackage => {
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
      return newTemplatePackages;
    });
  }

  // This is specified one user can only belongs to organization
  async findSubmission(email) {
    const userInfo = await this.usersRepository.findByEmail(email);
    const { orgId } = userInfo[0].sysRole[0].org[0];
    const programAndTempTypes = [];
    const programIds = [];
    userInfo[0].sysRole.forEach(sysRole => {
      sysRole.org[0].program.forEach(program => {
        programAndTempTypes.push({ program: program.programId, templateTypes: program.template });
        programIds.push(program.programId);
      });
    });
    return this.findTemplatePackage(programAndTempTypes).then(templatePackages => {
      const name = 'Unsubmitted';
      return this.statusRepository.findByName(name).then(status => {
        const promiseQuery1 = [];
        templatePackages.forEach(templatePackage => {
          promiseQuery1.push(
            this.submissionRepository
              .findByTemplatePackageId(templatePackage._id)
              .then(submissions => {
                if (!submissions[0]) {
                  const { templateIds } = templatePackage;
                  const promiseQuery3 = [];
                  if (templateIds !== undefined) {
                    templateIds.forEach(templateId => {
                      if (templatePackage.programIds !== undefined) {
                        templatePackage.programIds.forEach(programId => {
                          programAndTempTypes.forEach(element => {
                            if (element.program.toString() == programId.toString()) {
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
                        });
                      }
                    });
                    return Promise.all(promiseQuery3);
                  }
                }
              }),
          );
        });
        return Promise.all(promiseQuery1).then(() => {
          const changedSubmissions = [];
          return this.submissionRepository
            .findByOrgIdAndProgramId(orgId, programIds)
            .then(submissions => {
              const promiseQuery2 = [];
              submissions.forEach(submission => {
                const permission = [];
                this.checkUserRole(userInfo, submission, permission);
                promiseQuery2.push(
                  this.statusRepository.findById(submission.statusId).then(status => {
                    return this.templatePackageRepository
                      .findById(submission.templatePackageId)
                      .then(templatePackage => {
                        return this.submissionPeriodRepository
                          .findById(templatePackage.submissionPeriodId)
                          .then(submissionPeriod => {
                            return this.programRepository
                              .findById(submission.programId)
                              .then(program => {
                                const inflatedWorkbook = pako.inflate( submission._doc.workbookData.data, { to: 'string' });
                                submission._doc.workbookData.data = JSON.parse(inflatedWorkbook);
                                const changedSubmission = {
                                  ...submission._doc,
                                  programName: program.name,
                                  programId: program._id,
                                  period: submissionPeriod.name,
                                  phase: status.name,
                                  permission,
                                  parentId: submission.parentId
                                    ? submission.parentId
                                    : submission._id,
                                  templatePackageName: templatePackage.name,
                                };
                                changedSubmissions.push(cloneDeep(changedSubmission));
                                
                              });
                          });
                      });
                  }),
                );
              });
              return Promise.all(promiseQuery2).then(() => {
                return changedSubmissions;
              });
            });
        });
      });
    });
  }

  async openTemplate(submissionId, userEmail){
    // Temporary email
    userEmail = 'test34973737@gmail.com';
    //Retrieves template JSON from database
    const submission = await this.submissionRepository.findById(submissionId); 
    //Runs if there is already an existing google sheet 
    if (submission.googleSheetId){
      const res = await this.googleSheetRepository.findById(submission.googleSheetId);
      await Promise.resolve(addEditor(res.googleSheetId, userEmail));
      return res.googleSheetId;
    }

    let openPeriods = await this.reportingPeriodRepository.findSubmissionOpen();
    // Sends in the data from google sheet API and retrieves spreadsheetID
    let res = await Promise.resolve(createSpreadsheet(submission.workbookData.data, userEmail, true, openPeriods)); 
    const { userSpreadsheetId, duplicateSpreadsheetId, triggerId } = res;
    // Store Google Sheet Model to the database
    const googleSheetModel = {
      submissionId: submissionId,
      googleSheetId: userSpreadsheetId,
      duplicateId: duplicateSpreadsheetId,
      triggerId: triggerId,
    }
    res = await this.googleSheetRepository.create(googleSheetModel);
    // Update googleSheetId on templateModel
    this.submissionRepository.updateGoogleSheetId(submissionId, res._id);
    // createSheet(template.templateData.sheets, spreadsheetId);   
    return userSpreadsheetId;
  }
}
