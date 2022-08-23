import { Schema, model, Model, CallbackError } from 'mongoose';
import { AttributeConfigDoc } from '../../types/attributeconfig';

const AttributeConfig = new Schema<AttributeConfigDoc>(
  {
    attributeKeyword: { type: String },
    code: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: String },
  },
  { minimize: false },
);

AttributeConfig.pre(/^find/, function (this: Model<AttributeConfigDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const AttributeConfigModel = model<AttributeConfigDoc>('AttributeConfig', AttributeConfig, 'AttributeConfig');

export default AttributeConfigModel;
