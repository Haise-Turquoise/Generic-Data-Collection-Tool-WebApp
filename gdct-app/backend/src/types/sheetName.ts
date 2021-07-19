import { Document } from 'mongoose';

export default interface SheetName {
  id: number;
  name: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface SheetNameDoc extends SheetName, Document {
  id: number;
}