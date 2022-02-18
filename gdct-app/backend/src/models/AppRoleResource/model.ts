import { Schema, model } from 'mongoose';
import { AppRoleResourceDoc } from '../../types/approleresource';
const { ObjectId } = Schema.Types;

const AppRoleResourceModel = model<AppRoleResourceDoc>(
  'AppRoleResource',
  new Schema<AppRoleResourceDoc>(
    {
      appResourceId: { type: Object, ref: 'AppResource' },
      appSysRoleId: { type: Object, ref: 'AppSysRole' ,roleId:{type:ObjectId}, roleName:{type:String}},
      timestamp: { type: Date },
      resourceId:{type: Array, default:[]},
      // isActive:{type: Boolean},
      //    updatedDate: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
      updatedAt: { type: String },
    },
    { minimize: false },

  ),
  'AppRoleResource',
);

export default AppRoleResourceModel;
