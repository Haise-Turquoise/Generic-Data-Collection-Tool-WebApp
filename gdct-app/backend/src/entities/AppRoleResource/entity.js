export default class AppRoleResourceEntity {
  constructor({ _id, appSysRoleId, resourceId, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.appSysRoleId = appSysRoleId;
    this.resourceId = resourceId;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
