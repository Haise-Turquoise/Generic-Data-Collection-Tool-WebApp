import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface Submission {
  _id: ObjectId;
  templateId: ObjectId;
  templatePackageId: ObjectId;
  name: string;
  orgId: number;
  programId: ObjectId;
  submittedDate: Date;
  workbookData: any;
  templateName: string;
  approved: string;
  workflowProcessId: ObjectId|null;
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
  approver:string;
  _doc:any;
  parentId: ObjectId;
  updatedDate:Date;
}

export interface SubmissionDoc extends Submission, Document {
  _id:ObjectId
  id: number;
}
