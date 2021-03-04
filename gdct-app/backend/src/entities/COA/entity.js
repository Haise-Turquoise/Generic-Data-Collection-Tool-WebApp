export default class COAEntity {
  constructor({ _id, id, name, COA, timestamp, updatedBy }) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.COA = COA;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
