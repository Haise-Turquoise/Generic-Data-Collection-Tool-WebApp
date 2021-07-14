import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface UserSysRole {
  userId: ObjectId;
  appSysRole: ObjectId;
  organizationId: ObjectId;
  programId: ObjectId;
}

export interface UserSysRoleDoc extends UserSysRole, Document {}
