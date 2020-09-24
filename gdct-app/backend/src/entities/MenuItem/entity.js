export default class MenuItemEntity {
  constructor({ _id, name, url, description, type, role, isActive, orderId }) {
    this._id = _id;
    this.name = name;
    this.url = url;
    this.description = description;
    this.role = role;
    this.type = type;
    this.isActive = isActive;
    this.orderId = orderId;
  }
}
