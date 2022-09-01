import { ObjectId } from "mongodb";
import AppSys from "../../types/appsys";

export default class AppSysEntity {
  public _id: ObjectId;
  public name: string;
  public code: string;
  public isActive: boolean;
  public updatedAt: string;
  public updatedBy: string;

  constructor({ _id, name, code, isActive, updatedAt, updatedBy, }: AppSys) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.isActive = isActive;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
