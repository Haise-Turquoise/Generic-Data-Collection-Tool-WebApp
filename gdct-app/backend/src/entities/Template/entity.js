// It's possible that we can extend an object for all entity classes
export default class TemplateEntity {
  constructor({
    _id,
    name,
    templateData,
    templateTypeId,
    userCreatorId,
    creationDate,
    expirationDate,
    workflowProcessId,
  }) {
    this._id = _id;
    this.name = name;
    this.templateData = templateData;
    this.templateTypeId = templateTypeId;
    this.userCreatorId = userCreatorId;
    this.creationDate = creationDate;
    this.expirationDate = expirationDate;
    this.workflowProcessId = workflowProcessId;
  }
}
