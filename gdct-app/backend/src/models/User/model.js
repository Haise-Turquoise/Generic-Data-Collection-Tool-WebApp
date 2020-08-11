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
  console.log(doc.sysRoles);
  await doc.populate('sysRoles').execPopulate();
  console.log(doc.sysRoles);
});

User.methods.setHashedPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validatePassword = function (password) {
  console.log(bcrypt.compareSync(password, this.password));
  return bcrypt.compareSync(password, this.password);
};

// var User = new Schema(
//   {
//     username: { type: String, unique: true, required: true },
//     hashedUsername: { type: String, default: '' },
//     title: { type: String, default: '' },
//     ext: { type: String, default: '' },
//     email: { type: String, required: true },

//     firstName: { type: String, default: '' },
//     lastName: { type: String, default: '' },

//     phoneNumber: { type: String, default: '' },
//     sysRole: [
//       {
//         appSys: { type: String, default: '' },
//         role: { type: String, default: '' },
//         org: [
//           {
//             orgId: { type: String, default: '' },
//             IsActive: { type: Boolean },
//             program: [
//               {
//                 programId: { type: ObjectId, ref: 'program' },
//                 programCode: { type: String, default: '' },
//                 template: [
//                   {
//                     templateTypeId: { type: ObjectId, ref: 'templateType' },
//                     templateCode: { type: String, default: '' },
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],

//     startDate: { type: Date, default: Date.now, required: true },
//     endDate: { type: Date, default: Date.now, required: true },
//     IsActive: { type: Boolean, required: true, default: true },
//   },
//   { collection: 'User' }
// );

// User.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// User.pre(/^find/, function (next) {
//   this.find({ isActive: { $ne: false } });
//   next();
// });

// User.methods.checkPassword = async function (password, userPassword) {
//   return await bcrypt.compare(password, userPassword);
// };

// User.plugin(PassportLocalMongoose, {
//   usernameUnique: false,
//   findByUsername,
//   passwordValidator,
// });

const UserModel = model('User', User, 'User');

export default UserModel;
