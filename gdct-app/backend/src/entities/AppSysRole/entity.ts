import { ObjectId } from "mongodb";
import { AppSysRoleDoc } from "../../types/appsysrole";

export default class AppSysRoleEntity {
  public _id: ObjectId;
  public appSys: string;
  public role: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, appSys, role, timestamp, updatedBy, isActive }: AppSysRoleDoc) {
    this._id = _id;
    this.appSys = appSys;
    this.role = role;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
