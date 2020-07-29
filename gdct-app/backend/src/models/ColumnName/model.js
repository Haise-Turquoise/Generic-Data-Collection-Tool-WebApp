import { Schema, model } from 'mongoose';

const ColumnNameModel = model(
  'ColumnName',
  new Schema(
    {
      value: { type: String, required: true },
    },
    { minimize: false },
  ),
  'ColumnName',
);

export default ColumnNameModel;
