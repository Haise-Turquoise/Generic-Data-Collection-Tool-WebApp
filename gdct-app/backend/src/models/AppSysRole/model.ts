import { Schema, model } from 'mongoose';
import { AppSysRoleDoc } from '../../types/appsysrole';

const AppSysRole = new Schema<AppSysRoleDoc>(
  {
    appSys: { type: String },
    role: { type: String },
    timestamp: { type: Date },
    //    updatedDate: { type: Date },
    //    userCreatorId: { type: ObjectId, ref: 'User' },
    updatedBy: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false },
);

AppSysRole.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const AppSysRoleModel = model<AppSysRoleDoc>('AppSysRole', AppSysRole, 'AppSysRole');

export default AppSysRoleModel;
