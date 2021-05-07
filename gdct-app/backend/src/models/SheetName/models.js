import { Schema, model } from 'mongoose';

const SheetName = new Schema(
  {
    id: { type: Number },
    name: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false },
)

SheetName.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const SheetNameModel = model('SheetName', SheetName, 'SheetName');

export default SheetNameModel;
