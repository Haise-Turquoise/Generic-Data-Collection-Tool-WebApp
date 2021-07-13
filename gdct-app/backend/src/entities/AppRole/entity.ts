import { ObjectId } from "mongodb";
import { AppRoleDoc } from "../../types/approle";

export default class AppRoleEntity {
  public _id: ObjectId;
  public code: string;
  public name: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, code, name, timestamp, updatedBy, isActive }: AppRoleDoc) {
    this._id = _id;
    this.code = code;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
