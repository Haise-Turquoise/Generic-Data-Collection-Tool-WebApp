export default class COAGroupEntity {
  constructor({ _id, name, code, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
