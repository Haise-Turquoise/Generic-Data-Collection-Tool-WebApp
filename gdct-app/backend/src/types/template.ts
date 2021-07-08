import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface Template {
  name: string;
  workflowId: ObjectId;
  workflowProcessId: ObjectId;
  templateData: any[];
  templateTypeId: ObjectId;
  userCreatorId: ObjectId;
  creationDate: Date;
  expirationDate: Date;
  statusId: ObjectId;
  googleSheetId: ObjectId;
  timestamp: Date;
  updatedBy: string;
}

export interface TemplateDoc extends Template, Document {}
