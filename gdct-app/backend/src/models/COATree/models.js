import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const COATreeModel = model(
  'CategoryTree',
  new Schema(
    {
      parentId: { type: ObjectId, ref: 'CategoryTree' },
      categoryGroupId: { type: ObjectId, ref: 'CategoryGroup' },
      categoryId: [{ type: ObjectId, ref: 'Category' }],
      sheetNameId: { type: ObjectId, ref: 'SheetName' },
    },
    { minimize: false },
  ),
  'CategoryTree',
);

export default COATreeModel;
