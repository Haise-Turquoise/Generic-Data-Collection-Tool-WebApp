import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export default interface Category {
  _id: ObjectId;
  name: string;
  id: string;
  COA: string;
  unitOfMeasure: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface CategoryDoc extends Category, Document {
  _id: ObjectId;
  id: string;
}
