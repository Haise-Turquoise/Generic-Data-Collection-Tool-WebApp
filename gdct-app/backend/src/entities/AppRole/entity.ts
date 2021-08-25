import { ObjectId } from "mongodb";
import { AppRoleDoc } from "../../types/approle";

export default class AppRoleEntity {
  public _id: ObjectId;
  public code: string;
  public name: string;
  public updatedAt: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, code, name, updatedAt, updatedBy, isActive }: AppRoleDoc) {
    this._id = _id;
    this.code = code;
    this.name = name;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
