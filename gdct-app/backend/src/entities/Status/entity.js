export default class StatusEntity {
  constructor({ _id, name, description, timestamp, updatedBy, isActive, forPackage, order }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
    this.forPackage = forPackage;
    this.order = order;
  }
}
