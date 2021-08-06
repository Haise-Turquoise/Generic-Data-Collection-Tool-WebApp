import { Document } from 'mongoose';

export default interface RoleSubmissionButton{
  _id: string,
  role:string,
  button:string[],
}

export interface RoleSubmissionButtonDoc extends RoleSubmissionButton, Document {
  _id: string,
}