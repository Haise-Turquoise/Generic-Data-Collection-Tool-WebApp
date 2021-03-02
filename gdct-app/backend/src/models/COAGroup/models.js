import { Schema, model } from 'mongoose';

const COAGroupModel = model(
  'CategoryGroup',
  new Schema(
    {
      name: { type: String },
      code: { type: String },
      timestamp: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
      isActive: { type: Boolean },
    },
    { minimize: false },
  ),
  'CategoryGroup',
);

export default COAGroupModel;
