import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const COATreeModel = model(
  'CategoryTree',
  new Schema(
    {
      parentId: { type: ObjectId, ref: 'CategoryTree' },
      categoryGroupId: { type: ObjectId, ref: 'CategoryGroup' },
      categoryId: [{ type: Object, ref: 'Category' }],
      sheetNameId: { type: ObjectId, ref: 'SheetName' },
      timestamp: { type: Date },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'CategoryTree',
);

export default COATreeModel;
