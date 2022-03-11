import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export default interface Attribute {
  _id: ObjectId;
  name: string;
  id: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface AttributeDoc extends Attribute, Document {
  _id: ObjectId;
  id: string;
}
