export default class AppResourceEntity {
  constructor({ _id, id, resourceName, resourcePath, isProtected, timestamp, updatedBy, isActive }) {
    this._id = _id;
    this.id = id;
    this.resourceName = resourceName;
    this.resourcePath = resourcePath;
    this.isProtected = isProtected;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
