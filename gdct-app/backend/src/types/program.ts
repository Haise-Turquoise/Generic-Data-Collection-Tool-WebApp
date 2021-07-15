import { Document } from 'mongoose';

export default interface Program {
  name: string;
  code: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface ProgramDoc extends Program, Document {}
