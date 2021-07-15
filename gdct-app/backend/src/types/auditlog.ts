import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import User from "./user";

export default interface AuditLog {
  user: {_id: User["_id"], email: User["email"]},
  activity: string,
  moduleName: string,
  recordId: ObjectId,
  oldValue: any,
  newValue: any,
  timestamp: Date,
}

export interface AuditLogDoc extends AuditLog, Document {}