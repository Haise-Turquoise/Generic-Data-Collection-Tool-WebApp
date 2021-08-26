import { Document} from 'mongoose';
import { ObjectId } from "mongodb";
export default interface Program {
  _id:ObjectId;
  name: string;
  code: string;
  updatedAt: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface ProgramDoc extends Program, Document {
    _id:ObjectId
}
