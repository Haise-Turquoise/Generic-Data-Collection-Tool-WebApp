import { Document, ObjectId } from 'mongoose';

export default interface Program {
  _id:ObjectId;
  name: string;
  code: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface ProgramDoc extends Program, Document {
    _id:ObjectId
}
