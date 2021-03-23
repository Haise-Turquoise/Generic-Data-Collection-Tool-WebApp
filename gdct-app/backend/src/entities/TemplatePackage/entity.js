export default class TemplatePackageEntity {
  constructor({
    _id,
    name,
    submissionPeriodId,
    templateIds,
    statusId,
    creationDate,
    userCreatorId,
    programIds,
    timestamp,
    updatedBy,
  }) {
    this._id = _id;
    this.name = name;
    this.submissionPeriodId = submissionPeriodId;
    this.templateIds = templateIds;
    this.statusId = statusId;
    this.creationDate = creationDate;
    this.userCreatorId = userCreatorId;
    this.programIds = programIds;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
