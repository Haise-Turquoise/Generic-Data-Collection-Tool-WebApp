import { Schema, model } from 'mongoose';

const AppSys = new Schema(
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
  this.find({ isActive: { $ne: false } });
  next();
});

const AppSysModel = model('AppSys', AppSys, 'AppSys');

export default AppSysModel;
