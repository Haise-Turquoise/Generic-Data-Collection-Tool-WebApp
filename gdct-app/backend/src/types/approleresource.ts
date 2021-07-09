import { Document } from "mongoose";
import { ObjectId } from "mongodb";
import AppResource from "./appresource";

export default interface AppRoleResource {
  appResourceId: AppResource,
  appSysRoleId: {roleId: ObjectId, roleName: string},
  timestamp: Date,
  resourceId: {id: AppResource["_id"], resourceName: AppResource["resourceName"]}[]
  updatedBy: string,
}

export interface AppRoleResourceDoc extends AppRoleResource, Document {}
