import { Schema, model } from 'mongoose';

const AppResourceModel = model(
  'AppResource',
  new Schema(
    {
      id: { type: Number },
      resourceName: { type: String },
      resourcePath: { type: String },
      isProtected: { type: String },
      timestamp: { type: Date },
      updatedBy: { type: String },
    },
    { minimize: false, autoIndex: true },
  ),
  'AppResource',
);

export default AppResourceModel;
