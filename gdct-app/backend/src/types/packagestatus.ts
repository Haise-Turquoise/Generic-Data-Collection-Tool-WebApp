import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface PackageStatus {
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
    updatedDate: Date | '';
    updatedBy?: string;
  };
}

export interface PackageStatusDoc extends PackageStatus, Document {
  _id: ObjectId;
}
