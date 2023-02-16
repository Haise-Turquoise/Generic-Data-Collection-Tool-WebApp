import { Document } from "mongoose";
import User from "./user";

export default interface PurgeLog {
  user: {_id: User["_id"], email: User["email"]},
  numberArchived: Number,
  numberDeleted: Number,
  archiveMarkerDate: Date,
  purgeDate: Date,
}

export interface PurgeLogDoc extends PurgeLog, Document {}