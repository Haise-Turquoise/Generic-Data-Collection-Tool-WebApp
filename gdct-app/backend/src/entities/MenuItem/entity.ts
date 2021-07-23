import { ObjectId } from "mongodb";
import { MenuItemDoc } from "../../types/menuitem";

export default class MenuItemEntity {
  public _id: ObjectId;
  public name: string;
  public url: string;
  public description: string;
  public type: string;
  public role: string[];
  public isActive: boolean;
  public orderId: number;

  constructor({ _id, name, url, description, type, role, isActive, orderId }: MenuItemDoc) {
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
