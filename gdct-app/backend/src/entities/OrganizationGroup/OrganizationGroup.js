export default class OrgGroupEntity {
  constructor({ _id, id, name, isActive }) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.isActive = isActive;
  }
}
