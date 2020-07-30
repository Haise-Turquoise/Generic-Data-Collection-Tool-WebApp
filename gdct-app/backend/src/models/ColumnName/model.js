import { Schema, model } from 'mongoose';

const ColumnNameModel = model(
  'Attribute',
  new Schema(
    {
      name: { type: String, required: true },
      id: { type: Number, required: true, unique: true },
    },
    { minimize: false },
  ),
  'Attribute',
);

export default ColumnNameModel;
