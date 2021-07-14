import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface TemplatePackage {
  _id: ObjectId;
  name: string;
  submissionPeriodId: ObjectId;
  statusId: ObjectId;
  templateIds: ObjectId[];
  creationDate: Date;
  userCreatorId: ObjectId;
  programIds: ObjectId[];
  forPackage: boolean;
  timestamp: Date;
  updatedBy: string;
}

export interface TemplatePackageDoc extends TemplatePackage, Document {
  _id: ObjectId;
}