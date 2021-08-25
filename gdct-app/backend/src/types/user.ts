import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface User {
  _id: ObjectId,
  username: string;
  hashedUsername: string;
  email: string;
  title: string;
  ext: string;
  firstName: string;
  lastName: string;
  newPermissionPending: boolean;
  tempSysRole: UserSysRole[];
  newTemplates: any[];
  toBeApproved: any[];
  phoneNumber: string;
  pendingPermissions: any[];
  password: string;
  sysRole: UserSysRole[];
  facebook: {
    id: string;
    token: string;
    name: string;
  };
  google: {
    id: string;
    token: string;
    name: string;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  creationDate: Date;
  approvedDate: Date;
  startDate: Date;
  endDate: Date;
  updatedAt: Date;
  updatedBy: string;
  organizations:any;
  isApproved:boolean;
}

export interface UserSysRole{
  _id: ObjectId;
  appSys: string;
  role: string;
  appSysRoleId: ObjectId;
  org: {
    orgId: string;
    orgName: string;
    IsActive: boolean;
    program: {
      programId: ObjectId;
      programCode: string;
      template: {
        templateTypeId: ObjectId;
        templateCode: string;
        status: string;
      }[];
    }[];
  }[];
}


export interface UserDoc extends User, Document {
  _id: ObjectId,
}
