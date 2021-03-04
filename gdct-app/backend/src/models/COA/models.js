import { Schema, model } from 'mongoose';

const COAModel = model(
  'Category',
  new Schema(
    {
      name: { type: String },
      id: { type: String },
      COA: { type: String },
      unitOfMeassure : {type: String},
      timestamp: { type: Date },
      //    updatedDate: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'Category',
);

export default COAModel;