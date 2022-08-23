import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface TemplatePackage {
  _id: ObjectId;
  name: string;
  submissionPeriodId: ObjectId;
  statusId: ObjectId;
  templateIds: ObjectId[];
  creationDate: string;
  userCreatorId: ObjectId;
  programIds: ObjectId[];
  forPackage: boolean;
  updatedAt: string;
  updatedBy: string;
  deadline: string;
}

export interface TemplatePackageDoc extends TemplatePackage, Document {
  _id: ObjectId;
}
