import { Schema, model } from 'mongoose';

const AppResourceModel = model(
  'AppResource',
  new Schema(
    {
      name: { type: String },
      path: { type: String },
      contextRoot: { type: String },
      isProtected: { type: Boolean },
      timestamp: { type: Date },
      //    updatedDate: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
    },
    { minimize: false, autoIndex: true },
  ),
  'AppResource',
);

export default AppResourceModel;
