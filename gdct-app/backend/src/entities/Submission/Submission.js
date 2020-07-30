export default class SubmissionEntity {
  constructor({
    _id,
    id,
    name,
    orgId,
    templateId,
    templatePackageId,
    submittedDate,
    programId,
    workbookData,
    workflowProcessId,
    workflowId,
    statusId,
    year,
    submissionPeriodId,
    phase,
    createdAt,
    updatedAt,
    updatedBy,
    isPublished,
    version,
    isLatest,
    parentId,
  }) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.orgId = orgId;
    this.templateId = templateId;
    this.templatePackageId = templatePackageId;
    this.programId = programId;
    this.workbookData = workbookData;
    this.submittedDate = submittedDate;
    this.year = year;
    this.submissionPeriodId = submissionPeriodId;
    this.phase = phase;
    this.statusId = statusId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.workflowProcessId = workflowProcessId;
    this.workflowId = workflowId;
    this.isPublished = isPublished;
    this.version = version;
    this.isLatest = isLatest;
    this.parentId = parentId;
  }
}
