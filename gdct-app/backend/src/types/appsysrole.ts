import { Document } from "mongoose";

export default interface AppSysRole {
  appSys: string,
  role: string,
  updatedAt: Date,
  updatedBy: string,
  isActive: boolean,
  isSuperRole?: boolean,
}

export interface AppSysRoleDoc extends AppSysRole, Document {}