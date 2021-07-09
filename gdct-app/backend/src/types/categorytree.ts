import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export default interface CategoryTree {
  _id: ObjectId;
  parentId: ObjectId;
  categoryGroupId: ObjectId;
  categoryId: ObjectId[];
  sheetNameId: ObjectId;
  timestamp: Date;
  updatedBy: string;
}

export interface CategoryTreeDoc extends CategoryTree, Document {
  _id: ObjectId;
}
