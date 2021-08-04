import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export default interface CategoryTree {
  _id: ObjectId|null;
  parentId: ObjectId;
  categoryGroupId: ObjectId;
  categoryId: String[];
  sheetNameId: ObjectId;
  timestamp: Date;
  updatedBy: string;
}

export interface CategoryTreeDoc extends CategoryTree, Document {
  _id: ObjectId;
}

export interface OrganizedCategoryTree extends CategoryTree{
  childCategories?:OrganizedCategoryTree[];
}
