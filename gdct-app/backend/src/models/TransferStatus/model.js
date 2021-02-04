import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';

const TransferStatusModel = model(
  'TransferStatus',
  new Schema(
    {
      name: { type: String, required: true },
      isActive: { type: Boolean },
      interval: { type: Number},
      isUpdated: { type: Boolean },
      currentActiveProcess: { type: Object}
    },
    { minimize: false, timestamps: true },
  ),
  'TransferStatus',
);

export default TransferStatusModel;