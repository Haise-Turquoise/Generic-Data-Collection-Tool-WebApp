import { Schema, model } from 'mongoose';
import { AppConfigDoc } from '../../types/appconfig';

const AppConfig = new Schema<AppConfigDoc>(
  {
    key: { type: String },
    value: { type: String },
    appSys: { type: String },
    timestamp: { type: Date },
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
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const AppConfigModel = model<AppConfigDoc>('AppConfig', AppConfig, 'AppConfig');

export default AppConfigModel;
