import { Document } from "mongoose";

export default interface AppSysRole {
  appSys: string,
  role: string,
  timestamp: Date,
  updatedBy: string,
  isActive: boolean,
}

export interface AppSysRoleDoc extends AppSysRole, Document {}