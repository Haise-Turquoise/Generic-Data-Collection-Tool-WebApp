import { ObjectId } from "mongodb";
import { AppResourceDoc } from "../../types/appresource";

export default class AppResourceEntity {
  public _id: ObjectId;
  public id: number;
  public resourceName: string;
  public resourcePath: string;
  public isProtected: AppResourceDoc["isProtected"];
  public timestamp: Date;
  public updatedBy: string;

  constructor({ _id, id, resourceName, resourcePath, isProtected, timestamp, updatedBy }: AppResourceDoc) {
    this._id = _id;
    this.id = id;
    this.resourceName = resourceName;
    this.resourcePath = resourcePath;
    this.isProtected = isProtected;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
