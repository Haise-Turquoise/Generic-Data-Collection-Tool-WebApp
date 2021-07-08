import { Document, ObjectId } from 'mongoose';
export default interface Attribute {
  _id: string;
  name: string;
  id: string;
  timestamp: Date;
  updatedBy: string;
}

export interface AttributeDoc extends Document {
  name: string;
  id: string;
  timestamp: Date;
  updatedBy: string;
}
