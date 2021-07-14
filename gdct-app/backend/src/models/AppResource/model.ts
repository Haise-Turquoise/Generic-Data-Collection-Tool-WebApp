import { Schema, model } from 'mongoose';
import { AppResourceDoc } from '../../types/appresource';

const AppResourceModel = model<AppResourceDoc>(
  'AppResource',
  new Schema<AppResourceDoc>(
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
