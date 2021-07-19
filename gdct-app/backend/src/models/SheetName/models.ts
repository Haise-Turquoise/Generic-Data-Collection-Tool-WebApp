import { Schema, model, Model, CallbackError } from 'mongoose';
import { SheetNameDoc } from '../../types/sheetName';

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

SheetName.pre(/^find/, function (this: Model<SheetNameDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const SheetNameModel = model<SheetNameDoc>('SheetName', SheetName, 'SheetName');

export default SheetNameModel;
