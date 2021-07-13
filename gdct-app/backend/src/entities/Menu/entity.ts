import { ObjectId } from "mongodb";
import { MenuDoc } from "../../types/menu";

export default class MenuEntity {
  public _id: ObjectId;
  public items: ObjectId[];
  public name: string;
  public isSubMenu: boolean;
  public subMenus: ObjectId[];
  public type: string;
  public isActive: boolean;
  public orderId: number;
  public url: string;
  
  constructor({ _id, items, name, isSubMenu, subMenus, type, isActive, orderId, url }: MenuDoc) {
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
