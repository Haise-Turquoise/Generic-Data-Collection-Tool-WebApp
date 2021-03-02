import { Schema, model } from 'mongoose';

const SheetNameModel = model(
  'SheetName',
  new Schema(
    {
      // templateId: { type: ObjectId, ref: "Template" },
      name: { type: String },
      timestamp: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
      isActive: { type: Boolean },
    },
    { minimize: false },
  ),
  'SheetName',
);

export default SheetNameModel;
