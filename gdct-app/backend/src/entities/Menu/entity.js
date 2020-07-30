export default class MenuEntity {
  constructor({ _id, items, name, isSubMenu, subMenus, type, isActive }) {
    this._id = _id;
    this.items = items;
    this.name = name;
    this.isSubMenu = isSubMenu;
    this.subMenus = subMenus;
    this.type = type;
    this.isActive = isActive;
  }
}
