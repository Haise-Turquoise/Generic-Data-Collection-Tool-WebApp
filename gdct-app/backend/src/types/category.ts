import { Document } from 'mongoose';
export default interface Category {
  _id: string;
  name: string;
  id: string;
  COA: string;
  unitOfMeasure: string;
  timestamp: Date;
  updatedBy: string;
}

export interface CategoryDoc extends Document {
  name: string;
  id: string;
  COA: string;
  unitOfMeasure: string;
  timestamp: Date;
  updatedBy: string;
}
