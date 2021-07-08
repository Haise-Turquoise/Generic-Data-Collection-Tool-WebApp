import { Schema, model } from 'mongoose';
import { AppSysDoc } from '../../types/appsys';

const AppSys = new Schema<AppSysDoc>(
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
  { minimize: false },
);

AppSys.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const AppSysModel = model<AppSysDoc>('AppSys', AppSys, 'AppSys');

export default AppSysModel;
