export default class AppSysEntity {
  constructor({ _id, name, code, isActive, timestamp, updatedBy, }) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.isActive = isActive;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
