import { ObjectId } from "mongodb";
import { AppSysRoleDoc } from "../../types/appsysrole";

export default class AppSysRoleEntity {
  public _id: ObjectId;
  public appSys: string;
  public role: string;
  public updatedAt: Date;
  public updatedBy: string;
  public isActive: boolean;
  public isSuperRole?: boolean;

  constructor({ _id, appSys, role, updatedAt, updatedBy, isActive, isSuperRole }: AppSysRoleDoc) {
    this._id = _id;
    this.appSys = appSys;
    this.role = role;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
    this.isSuperRole = isSuperRole;
  }
}
