import { Document } from 'mongoose';

export default interface Workflow {
  name: string;
  timestamp: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface WorkflowDoc extends Workflow, Document {}
