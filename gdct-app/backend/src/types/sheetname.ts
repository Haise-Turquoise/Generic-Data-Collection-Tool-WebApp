import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface SheetName {
  _id: ObjectId,
  id: number;
  name: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface SheetNameDoc extends SheetName, Document {
  _id: ObjectId,
  id: number;
}
