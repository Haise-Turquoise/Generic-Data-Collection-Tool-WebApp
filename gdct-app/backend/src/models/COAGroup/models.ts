import { Schema, model } from 'mongoose';
import { CategoryGroupDoc as CategoryGroup, CategoryGroupDoc } from '../../types/categorygroup';

const COAGroupModel = model<CategoryGroupDoc>(
  'CategoryGroup',
  new Schema<CategoryGroupDoc>(
    {
      name: { type: String },
      code: { type: String },
      timestamp: { type: Date },
      updatedBy: { type: String },
      isActive: { type: Boolean },
    },
    { minimize: false },
  ),
  'CategoryGroup',
);

export default COAGroupModel;
