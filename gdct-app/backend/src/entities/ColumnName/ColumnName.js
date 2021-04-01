export default class ColumnName {
  constructor({ _id, id, name, timestamp, updatedBy }) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
