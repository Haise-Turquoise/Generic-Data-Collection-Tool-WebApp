export default class SheetNameEntity {
  constructor({
    _id,
    id,
    name,
    timestamp,
    updatedBy,
    isActive,
  }) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
