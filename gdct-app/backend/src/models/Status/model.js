import { Schema, model } from 'mongoose';

const Status = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
    forPackage: { type: Boolean },
  },
  { minimize: false, timestamps: true },
)

Status.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const StatusModel = model('Status', Status, 'Status');

export default StatusModel;
