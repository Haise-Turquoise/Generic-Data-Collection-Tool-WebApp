import { Schema, model } from 'mongoose';
import { AppRoleDoc } from '../../types/approle';

const AppRole = new Schema<AppRoleDoc>(
  {
    code: { type: String },
    name: { type: String },
    timestamp: { type: Date },
//    userCreatorId: { type: ObjectId, ref: 'User' },
    updatedBy: { type: String },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { minimize: false, autoIndex: true },
);

AppRole.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next(); 
});

const AppRoleModel = model<AppRoleDoc>('AppRole', AppRole, 'AppRole');

export default AppRoleModel;
