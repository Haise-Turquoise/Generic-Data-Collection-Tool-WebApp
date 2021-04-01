export default class WorkflowEntity {
  constructor({ _id, name, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
