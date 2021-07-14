import { Document } from 'mongoose';

export default interface TransferStatus {
  name: string;
  isActive: boolean;
  interval: number;
  isUpdated: boolean;
  currentActiveProcess: any;
}

export interface TransferStatusDoc extends TransferStatus, Document {}
