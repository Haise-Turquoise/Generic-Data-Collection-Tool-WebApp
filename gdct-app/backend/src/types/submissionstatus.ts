import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface SubmissionStatus {
  _id: ObjectId;
  name: string;
  org: {
    id: number;
    name: string;
  };
  template: {
    name: string;
  };
  submission?: {
    _id: ObjectId;
    name: string;
  };
  subIndex: number | null;
  program: {
    code: string;
    name: string;
  };
  status: {
    name: string;
  };
  submissionPeriod: {
    name: string;
  };
  templateType: {
    name: string;
  };
  submissionNote: {
    submissionId: ObjectId;
    updatedDate: Date | '';
    updatedBy?: string;
  };
  reportingPeriod: {
    submissionClosed: boolean;
  }
}

export interface SubmissionStatusDoc extends SubmissionStatus, Document {
  _id: ObjectId;
}
