export default class AppSysRoleEntity {
  constructor({ _id, appSys, role, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.appSys = appSys;
    this.role = role;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
