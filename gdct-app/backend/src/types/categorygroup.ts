import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export default interface CategoryGroup {
  _id: ObjectId;
  name: string;
  code: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface CategoryGroupDoc extends CategoryGroup, Document {
  _id: ObjectId
}
