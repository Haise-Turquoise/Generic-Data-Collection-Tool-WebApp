export default class AppRoleEntity {
  constructor({ _id, code, name, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.code = code;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
