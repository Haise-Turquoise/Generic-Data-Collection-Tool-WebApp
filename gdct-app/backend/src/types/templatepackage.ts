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
  updatedAt: Date;
  updatedBy: string;
  deadline: string;
}

export interface TemplatePackageDoc extends TemplatePackage, Document {
  _id: ObjectId;
}
