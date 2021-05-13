import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const AppRoleResourceModel = model(
  'AppRoleResource',
  new Schema(
    {
      appResourceId: { type: Object, ref: 'AppResource' },
      appSysRoleId: { type: Object, ref: 'AppSysRole' ,roleId:{type:ObjectId}, roleName:{type:String}},
      timestamp: { type: Date },
      resourceId:{type: Array, default:[]},
      // isActive:{type: Boolean},
      //    updatedDate: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'AppRoleResource',
);

export default AppRoleResourceModel;
