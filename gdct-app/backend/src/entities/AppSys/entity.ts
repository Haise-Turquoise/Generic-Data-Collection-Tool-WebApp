import { ObjectId } from "mongodb";
import AppSys from "../../types/appsys";

export default class AppSysEntity {
  public _id: ObjectId;
  public name: string;
  public code: string;
  public isActive: boolean;
  public timestamp: Date;
  public updatedBy: string;

  constructor({ _id, name, code, isActive, timestamp, updatedBy, }: AppSys) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.isActive = isActive;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
