import { Document } from 'mongoose';
export default interface CategoryGroup {
  _id: string;
  name: string;
  code: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface CategoryGroupDoc extends Document {
  name: string;
  code: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}
