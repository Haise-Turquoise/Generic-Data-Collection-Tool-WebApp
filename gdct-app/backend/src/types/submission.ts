import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import TemplatePackage from '../entities/TemplatePackage';
import Program from './program';
import Status from './status';
import SubmissionPeriod from './submissionperiod';
import { SheetData } from './template';
import User from './user';
import WorkflowProcess from './workflowprocess';

export default interface Submission {
  _id?: ObjectId;
  templateId: ObjectId;
  templatePackageId: ObjectId;
  name: string;
  orgId: number;
  programId: ObjectId;
  submittedDate: Date | null;
  workbookData: SheetData[];
  templateName: string;
  approved: string;
  workflowProcessId: ObjectId|null;
  workflowId: ObjectId;
  statusId: ObjectId;
  year?: string;
  submissionPeriodId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: ObjectId;
  isPublished: boolean;
  version: number;
  isLatest: boolean;
  approver:string;
  _doc?:any;
  parentId?: ObjectId;
  updatedDate:Date;
}

export interface SubmissionPopulated {
  statusId: Status,
  workflowProcessId: WorkflowProcess,
  submissionPeriodId: SubmissionPeriod,
  _id: ObjectId;
  templateId: ObjectId;
  templatePackageId: TemplatePackage;
  name: string;
  orgId: number;
  programId: Program;
  submittedDate: Date;
  workbookData: any;
  templateName: string;
  approved: string;
  workflowId: ObjectId;
  year: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: User;
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

export interface SubmissionAggregated {
  [key: string]: SubmissionPopulated[]
}
