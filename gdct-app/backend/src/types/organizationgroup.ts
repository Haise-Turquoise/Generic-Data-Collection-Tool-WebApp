import { Document } from 'mongoose';
import { ObjectId } from "mongodb";
export default interface OrganizationGroup {
  _id: ObjectId;
  name: string;
  isActive: boolean;
  updatedAt: any;
  updatedBy: string;
  createdBy:string;
}

export interface OrganizationGroupDoc extends OrganizationGroup, Document {
  _id: ObjectId;
}
