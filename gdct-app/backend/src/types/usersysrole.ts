import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface UserSysRole {
  templateTypeId: ObjectId;
  appSysRole: string;
  organizationId: string;
  programId: ObjectId;
}

export interface UserSysRoleDoc extends UserSysRole, Document {}
