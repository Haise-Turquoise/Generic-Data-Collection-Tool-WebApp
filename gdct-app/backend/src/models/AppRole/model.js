import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const AppRole = new Schema(
  {
    code: { type: String },
    name: { type: String },
    timestamp: { type: Date },
//    updatedDate: { type: Date },
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
  this.find({ isActive: { $ne: false } });
  next(); 
});

const AppRoleModel = model('AppRole', AppRole, 'AppRole');

export default AppRoleModel;
