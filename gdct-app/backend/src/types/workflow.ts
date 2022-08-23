import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface Workflow {
  _id: ObjectId;
  name: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface WorkflowDoc extends Workflow, Document {
  _id: ObjectId;
}
