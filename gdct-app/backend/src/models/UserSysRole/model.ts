import { Schema, model } from 'mongoose';
import { UserSysRoleDoc } from '../../types/usersysrole';

const { ObjectId } = Schema.Types;

const UserSysRoleModel = model<UserSysRoleDoc>(
  'UserSysRole',
  new Schema<UserSysRoleDoc>(
    {
      userId: { type: ObjectId, ref: 'User' },
      appSysRoleId: { type: ObjectId, ref: 'AppSysRole' },
      organizationId: { type: ObjectId, ref: 'Organization' },
      programId: { type: ObjectId, ref: 'Program' },
    },
    { minimize: false },
  ),
  'UserSysRole',
);

export default UserSysRoleModel;
