export default class AppConfigEntity {
    constructor({ _id, value, key, appSys, isActive }) {
      this._id = _id;
      this.value = value;
      this.key = key;
      this.appSys = appSys;
      this.isActive = isActive;
    }
  }
  