import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface Submission {
  id: number;
  templateId: ObjectId;
  templatePackageId: ObjectId;
  name: string;
  orgId: number;
  programId: ObjectId;
  submittedDate: Date;
  workbookData: any;
  templateName: string;
  approved: string;
  workflowProcessId: ObjectId;
  workflowId: ObjectId;
  statusId: ObjectId;
  year: string;
  submissionPeriodId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId;
  isPublished: boolean;
  version: number;
  isLatest: boolean;
  parentId: ObjectId;
}

export interface SubmissionDoc extends Submission, Document {
  id: number;
}
