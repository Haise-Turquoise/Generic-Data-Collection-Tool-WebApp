import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export default interface Organization {
  id: number,
  IFISNum: string,
  code: string,
  name: string,
  legalName: string,
  address: string,
  province: string,
  city: string,
  postalCode: string,
  location: string[],
  organizationGroupId: ObjectId[],
  active: boolean,
  managerUserIds: ObjectId[],
  authorizedPerson: {name:string, email:string}
  // contactUserId: string,
  // authorizedUserId: string,
  programId: ObjectId[],
  effectiveDate: any,
  expiryDate: any,
  updatedAt: string,
  updatedBy: string,
}

export interface OrganizationDoc extends Organization, Document {
  id: number,
}
