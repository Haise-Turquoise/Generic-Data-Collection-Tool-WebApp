import { Schema, model } from 'mongoose';
import { CategoryDoc as Category } from '../../types/category'

const COAModel = model<Category>(
  'Category',
  new Schema<Category>(
    {
      name: { type: String },
      id: { type: String },
      COA: { type: String },
      unitOfMeasure : {type: String},
      timestamp: { type: Date },
      updatedBy: { type: String },
      updatedAt: { type: String },
    },
    { minimize: false },
  ),
  'Category',
);

export default COAModel;