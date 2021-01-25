export default class StatusEntity {
  constructor({ _id, name, description, isActive, forPackage }) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.forPackage = forPackage;
  }
}
