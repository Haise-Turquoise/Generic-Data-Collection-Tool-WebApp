import { Document } from "mongoose";

export default interface AppRole {
  code: string,
  name: string,
  timestamp: Date,
  updatedBy: string,
  isActive: boolean,
}

export interface AppRoleDoc extends AppRole, Document {}
