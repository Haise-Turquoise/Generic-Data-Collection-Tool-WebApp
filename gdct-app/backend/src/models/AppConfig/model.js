import { Schema, model } from 'mongoose';

const AppConfig = new Schema(
  {
    key: { type: String },
    value: { type: String },
    appSys: { type: String },
    timestamp: {type: Date, default: Date.now},
    //    updatedDate: { type: Date },
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

AppConfig.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const AppConfigModel = model('AppConfig', AppConfig, 'AppConfig');

export default AppConfigModel;
