import { ObjectId } from 'mongodb';
import { Schema, model, Model, CallbackError } from 'mongoose';
import { SheetNameDoc } from '../../types/sheetName';

const SheetName = new Schema<SheetNameDoc>(
  {
    id: { type: Number },
    name: { type: String },
    timestamp: { type: Date },
    templateTypeId: { type: String },
    updatedBy: { type: String },
    updatedAt: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false },
)

const SheetNameModel = model<SheetNameDoc>('SheetName', SheetName, 'SheetName');

export default SheetNameModel;
