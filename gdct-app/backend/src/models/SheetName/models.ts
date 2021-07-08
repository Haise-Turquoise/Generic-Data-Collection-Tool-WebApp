import { Schema, model } from 'mongoose';
import { SheetNameDoc } from '../../types/sheetname';

const SheetName = new Schema<SheetNameDoc>(
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
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const SheetNameModel = model<SheetNameDoc>('SheetName', SheetName, 'SheetName');

export default SheetNameModel;
