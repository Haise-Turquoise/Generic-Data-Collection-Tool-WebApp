import { Schema, model } from 'mongoose';
import { StatusDoc } from '../../types/status';

const Status = new Schema<StatusDoc>(
  {
    name: { type: String, required: true },
    description: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
    forPackage: { type: Boolean },
    order: { type: Number }
  },
  { minimize: false, timestamps: true },
)

Status.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const StatusModel = model<StatusDoc>('Status', Status, 'Status');

export default StatusModel;
