import { Document, ObjectId } from 'mongoose';

export default interface CategoryTree {
  _id: string;
  parentId: ObjectId;
  categoryGroupId: ObjectId;
  categoryId: ObjectId[];
  sheetNameId: ObjectId;
  timestamp: Date;
  updatedBy: string;
}

export interface CategoryTreeDoc extends Document {
  parentId: ObjectId;
  categoryGroupId: ObjectId;
  categoryId: ObjectId[];
  sheetNameId: ObjectId;
  timestamp: Date;
  updatedBy: string;
}
