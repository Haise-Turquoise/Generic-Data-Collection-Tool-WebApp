import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const COATreeModel = model(
  'CategoryTree',
  new Schema(
    {
      parentId: { type: ObjectId, ref: 'CategoryTree' },
      COAGroupId: { type: ObjectId, ref: 'CategoryGroup' },
      COAIds: [{ type: ObjectId, ref: 'Category' }],
      sheetNameId: { type: ObjectId, ref: 'SheetName' },
    },
    { minimize: false },
  ),
  'CategoryTree',
);

export default COATreeModel;
