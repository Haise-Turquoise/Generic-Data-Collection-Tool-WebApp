import { Schema, model, Model, CallbackError } from 'mongoose';
import { AppConfigDoc } from '../../types/appconfig';

const AppConfig = new Schema<AppConfigDoc>(
  {
    key: { type: String },
    value: { type: String },
    appSys: { type: String },
    timestamp: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: String },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { minimize: false },
);

AppConfig.pre(/^find/, function (this: Model<AppConfigDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const AppConfigModel = model<AppConfigDoc>('AppConfig', AppConfig, 'AppConfig');

export default AppConfigModel;
