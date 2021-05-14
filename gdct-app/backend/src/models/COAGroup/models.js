import { Schema, model } from 'mongoose';

const COAGroupModel = model(
  'CategoryGroup',
  new Schema(
    {
      name: { type: String },
      code: { type: String },
      timestamp: { type: Date },
      updatedBy: { type: String },
      isActive: { type: Boolean },
    },
    { minimize: false },
  ),
  'CategoryGroup',
);

export default COAGroupModel;
