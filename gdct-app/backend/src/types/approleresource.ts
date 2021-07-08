import { Document } from "mongoose";
import AppResource from "./appresource";
import AppSysRole from "./appsysrole";

export default interface AppRoleResource {
  appResourceId: AppResource,
  appSysRoleId: AppSysRole,
  timestamp: Date,
  resourceId: {_id: AppResource["_id"], resourceName: AppResource["resourceName"]}[]
  updatedBy: string,
}

export interface AppRoleResourceDoc extends AppRoleResource, Document {}
