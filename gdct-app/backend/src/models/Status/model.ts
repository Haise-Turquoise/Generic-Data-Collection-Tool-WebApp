import { Schema, model, Model, CallbackError } from 'mongoose';
import { StatusDoc } from '../../types/status';

const Status = new Schema<StatusDoc>(
  {
    name: { type: String, required: true },
    description: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: String },
    updatedAt: {type: String },
    isActive: { type: Boolean },
    forPackage: { type: Boolean },
    order: { type: Number }
  },
  { minimize: false, timestamps: true },
)

const StatusModel = model<StatusDoc>('Status', Status, 'Status');

export default StatusModel;
