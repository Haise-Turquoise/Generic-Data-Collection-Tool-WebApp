import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export default interface AppSys {
  _id: ObjectId,
  code: string,
  name: string,
  updatedAt: any,
  updatedBy: string,
  isActive: boolean,
}

export interface AppSysDoc extends AppSys, Document {
  _id: ObjectId
}
