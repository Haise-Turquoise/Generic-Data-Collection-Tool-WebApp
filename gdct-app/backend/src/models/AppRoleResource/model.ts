import { Schema, model } from 'mongoose';
import { AppResourceDoc } from '../../types/appresource';
const { ObjectId } = Schema.Types;

const AppRoleResourceModel = model<AppResourceDoc>(
  'AppRoleResource',
  new Schema<AppResourceDoc>(
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
