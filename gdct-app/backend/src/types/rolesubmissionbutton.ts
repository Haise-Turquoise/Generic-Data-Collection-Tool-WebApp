import { Document } from 'mongoose';

export default interface RoleSubmissionButton{
  role:string,
  button:string[],
}

export interface RoleSubmissionButtonDoc extends RoleSubmissionButton, Document { }