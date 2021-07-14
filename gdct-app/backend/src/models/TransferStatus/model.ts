import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';
import { TransferStatusDoc } from '../../types/transferstatus';

const TransferStatusModel = model<TransferStatusDoc>(
  'TransferStatus',
  new Schema<TransferStatusDoc>(
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