import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface WorkflowProcess {
  _id: string;
  workflowId: ObjectId;
  statusId: ObjectId;
  to: ObjectId[];
  position: { x: number; y: number };
}

export interface WorkflowProcessDoc extends WorkflowProcess, Document {
  id: string;
}
