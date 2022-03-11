import { ObjectId } from "mongodb";
import { AuditLogDoc } from "../../types/auditlog";

export default class AuditLogEntity {
  public _id: ObjectId;
  public user: AuditLogDoc["user"];
  public activity: string;
  public moduleName: string;
  public updatedAt: Date;

  constructor({ _id, user, activity, moduleName, updatedAt }: AuditLogDoc) {
    this._id = _id;
    this.user = user;
    this.activity = activity;
    this.moduleName = moduleName;
    this.updatedAt = updatedAt;
  }
}
  