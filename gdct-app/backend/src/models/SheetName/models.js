import { Schema, model } from 'mongoose';

const SheetNameModel = model(
  'SheetName',
  new Schema(
    {
      id: { type: Number },
      name: { type: String },
      timestamp: { type: Date },
      updatedBy: { type: String },
      isActive: { type: Boolean },
    },
    { minimize: false },
  ),
  'SheetName',
);

export default SheetNameModel;
