import { Document} from "mongoose";
import { ObjectId } from "mongodb";
export default interface Status {
  _id:ObjectId,
  name: string,
  description: string,
  timestamp: Date,
  updatedBy: string,
  isActive: boolean,
  forPackage: boolean,
  order: number,
}

export interface StatusDoc extends Status, Document {
    _id:ObjectId
}
