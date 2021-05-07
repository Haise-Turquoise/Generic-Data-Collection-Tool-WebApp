import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const AppRoleResourceModel = model(
  'AppRoleResource',
  new Schema(
    {
      appResourceId: { type: ObjectId, ref: 'AppResource' },
      appSysRoleId: [{ type: ObjectId, ref: 'AppSysRole' }],
      timestamp: { type: Date },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'AppRoleResource',
);

export default AppRoleResourceModel;
