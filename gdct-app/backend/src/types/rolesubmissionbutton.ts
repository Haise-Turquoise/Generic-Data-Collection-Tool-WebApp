import { Document } from 'mongoose';

export default interface RoleSubmissionButton{
  _id: string,
  role:string,
  button:string[],
  modifiedOn: Date,
  updatedBy: string,
}

export interface RoleSubmissionButtonDoc extends RoleSubmissionButton, Document {
  _id: string,
}