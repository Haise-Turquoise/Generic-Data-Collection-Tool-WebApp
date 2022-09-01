import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import AppResource from "./appresource";
import AppSysRole from "./appsysrole";

export default interface AppRoleResource {
  appResourceId: AppResource,
  appSysRoleId: {roleId: ObjectId, roleName: string},
  updatedAt: any,
  resourceId: {id: AppResource["_id"], resourceName: AppResource["resourceName"]}[]
  updatedBy: string,
}

export interface AppRoleResourceDoc extends AppRoleResource, Document {}
