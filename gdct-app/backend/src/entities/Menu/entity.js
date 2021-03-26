export default class MenuEntity {
  constructor({ _id, items, name, isSubMenu, subMenus, type, isActive, orderId, url }) {
    this._id = _id;
    this.items = items;
    this.name = name;
    this.isSubMenu = isSubMenu;
    this.subMenus = subMenus;
    this.type = type;
    this.isActive = isActive;
    this.orderId = orderId;
    this.url = url;
  }
}
