import Container from 'typedi';
import cloneDeep from 'clone-deep';
import SubmissionRepository from '../../repositories/Submission';
import SubmissionNoteRepository from '../../repositories/SubmissionNote';
import { extractSubmissionMasterValues } from '../../utils/excel/COA';
import TemplateRepository from '../../repositories/Template';
import StatusRepository from '../../repositories/Status';
import TemplatePackageRepository from '../../repositories/TemplatePackage';
import MasterValueRepository from '../../repositories/MasterValue';
import ProgramRepository from '../../repositories/Program';
import OrgRepository from '../../repositories/Organization';
import TemplateTypeRepository from '../../repositories/TemplateType';
import WorkflowProcessRepository from '../../repositories/WorkflowProcess';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';

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
  }

  async createSubmissionBaseOnTemplatePackage(submission) {
    // Clone the tempalte's workbook data to be used by the user

    return this.programRepository.findById(submission.programId).then(program => {
      return this.templateRepository.findById(submission.templateId).then(template => {
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
              submission.workflowId = templateType.submissionWorkflowId;
              return this.submissionRepository.create(submission);
            });
        });
      });
    });
  }

  async uploadSubmissionWorkbook(submission, workbookData, submissionNote) {
    const currentStatus = await this.statusRepository.findById(submission.statusId);
    if (currentStatus.name == 'Approved') return;

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
                extractSubmissionMasterValues(
                  id,
                  submission,
                  orgConst,
                  programConst,
                  templateConst,
                  templateTypeConst,
                );
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
    console.log(submissionNote);

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

  async findSubmission(orgId, programIds) {
    return this.templatePackageRepository.findByProgramIds(programIds).then(templatePackages => {
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
                          if (programIds.find(program => program == programId) != undefined) {
                            promiseQuery3.push(
                              this.createSubmissionBaseOnTemplatePackage({
                                orgId,
                                templateId,
                                templatePackageId: templatePackage._id,
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
                promiseQuery2.push(
                  this.statusRepository.findById(submission.statusId).then(status => {
                    return this.templatePackageRepository
                      .findById(submission.templatePackageId)
                      .then(templatePackage => {
                        console.log(templatePackage);
                        return this.submissionPeriodRepository
                          .findById(templatePackage.submissionPeriodId)
                          .then(submissionPeriod => {
                            console.log(submissionPeriod);
                            return this.programRepository
                              .findById(submission.programId)
                              .then(program => {
                                const changedSubmission = {
                                  ...submission._doc,
                                  programName: program.name,
                                  programId: program._id,
                                  period: submissionPeriod.name,
                                  phase: status.name,
                                  parentId: submission.parentId
                                    ? submission.parentId
                                    : submission._id,
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
}
