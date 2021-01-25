// import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Schema, model } from 'mongoose';

import bcrypt from 'bcrypt-nodejs';

const { ObjectId } = Schema.Types;

dotenv.config();

const User = new Schema(
  {
    username: { type: String, lowercase: true, required: true },
    hashedUsername: { type: String, default: '' },
    email: { type: String, required: true },

    title: { type: String, default: '' },
    ext: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },

    phoneNumber: { type: String, default: '' },

    password: String,
    sysRole: [
      {
        appSys: { type: String, default: '' },
        role: { type: String, default: '' },
        appSysRoleId: { type: ObjectId, ref: 'AppSysRole' },
        org: [
          {
            orgId: { type: String, default: '' },
            orgName: { type: String, default: '' },
            IsActive: { type: Boolean },
            program: [
              {
                programId: { type: ObjectId, ref: 'program' },
                programCode: { type: String, default: '' },
                template: [
                  {
                    templateTypeId: { type: ObjectId, ref: 'templateType' },
                    templateCode: { type: String, default: '' },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    facebook: {
      id: String,
      token: String,
      name: String,
    },
    google: {
      id: String,
      token: String,
      name: String,
    },
    isActive: {
      type: Boolean,
      default: false,
      // select: false,
    },
    isEmailVerified: { type: Boolean, required: true, default: false },

    creationDate: { type: Date, default: Date.now, required: true },
    approvedDate: { type: Date, default: Date.now, required: true },

    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamp: true, minimize: false },
);

User.post('save', async function (doc, next) {
  await doc.populate('sysRoles').execPopulate();
});

User.methods.setHashedPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = model('User', User, 'User');

export default UserModel;
