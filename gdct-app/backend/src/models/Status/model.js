import { Schema, model } from 'mongoose';

const StatusModel = model(
  'Status',
  new Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      isActive: { type: Boolean },
      forPackage:{type: Boolean},
    },
    { minimize: false, timestamps: true },
  ),
  'Status',
);

export default StatusModel;
