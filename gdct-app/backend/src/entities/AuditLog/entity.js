export default class AuditLogEntity {
    constructor({ _id, user, activity, module, timestamp }) {
      this._id = _id;
      this.user = user;
      this.activity = activity;
      this.module = module;
      this.timestamp = timestamp;
    }
  }
  