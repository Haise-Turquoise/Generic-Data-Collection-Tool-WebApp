import { ObjectId } from "mongodb";
import { AppRoleResourceDoc } from "../../types/approleresource";

export default class AppRoleResourceEntity {
  public _id: ObjectId;
  public appSysRoleId: AppRoleResourceDoc["appSysRoleId"];
  public resourceId: AppRoleResourceDoc["resourceId"];
  public updatedAt: Date;
  public updatedBy: string;

  constructor({ _id, appSysRoleId, resourceId, updatedAt, updatedBy }: AppRoleResourceDoc) {
    this._id = _id;
    this.appSysRoleId = appSysRoleId;
    this.resourceId = resourceId;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
