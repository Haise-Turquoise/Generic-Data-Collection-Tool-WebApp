import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface SysRole {
    appSys: string;
    role: string;
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

export interface SysRoleDoc extends SysRole, Document {}