export default class AppConfigEntity {
  constructor({ _id, value, key, appSys, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.value = value;
    this.key = key;
    this.appSys = appSys;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
  