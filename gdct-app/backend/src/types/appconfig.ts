import { Document } from "mongoose";

export default interface AppConfig {
  key: string,
  value: string,
  appSys: string,
  updatedAt: Date,
  updatedBy: string,
  isActive: boolean,
}

export interface AppConfigDoc extends AppConfig, Document {}
