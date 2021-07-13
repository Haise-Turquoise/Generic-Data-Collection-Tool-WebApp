import { Document } from "mongoose";

export default interface Status {
  name: string,
  description: string,
  timestamp: Date,
  updatedBy: string,
  isActive: boolean,
  forPackage: boolean,
  order: number,
}

export interface StatusDoc extends Status, Document {}
