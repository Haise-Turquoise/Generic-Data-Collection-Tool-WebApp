import { ObjectId } from "mongodb";
import { AppConfigDoc } from "../../types/appconfig";

export default class AppConfigEntity {
  public _id: ObjectId;
  public value: string;
  public key: string;
  public appSys: string;
  public updatedAt: string;
  public updatedBy: string;
  public isActive: boolean;
  
  constructor({ _id, value, key, appSys, updatedAt, updatedBy, isActive }: AppConfigDoc) {
    this._id = _id;
    this.value = value;
    this.key = key;
    this.appSys = appSys;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
  