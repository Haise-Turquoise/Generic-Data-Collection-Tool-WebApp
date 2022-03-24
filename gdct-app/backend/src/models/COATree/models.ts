import { Schema, model } from 'mongoose';
import { CategoryTreeDoc as CategoryTree } from '../../types/categorytree';

const { ObjectId } = Schema.Types;

const COATreeModel = model<CategoryTree>(
  'CategoryTree',
  new Schema<CategoryTree>(
    {
      parentId: { type: ObjectId, ref: 'CategoryTree' },
      categoryGroupId: { type: ObjectId, ref: 'CategoryGroup' },
      categoryId: [{ type: String, ref: 'Category' }],
      sheetNameId: { type: ObjectId, ref: 'SheetName' },
      timestamp: { type: Date },
      updatedBy: { type: String },
      updatedAt: { type: String },
    },
    { minimize: false },
  ),
  'CategoryTree',
);

export default COATreeModel;
