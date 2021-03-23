export default class SheetNameEntity {
  constructor({
    _id,
    name,
    timestamp,
    updatedBy,
    isActive,
    // templateId
  }) {
    this._id = _id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
    // this.templateId = templateId
  }
}
