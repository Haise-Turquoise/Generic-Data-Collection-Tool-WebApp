import { Document, ObjectId } from 'mongoose';

export default interface RoleWorkflowStatus{
  _id:ObjectId,
  role:string,
  workflowStatus:string[],
  __v:number
}

export interface RoleWorkflowStatusDoc extends Document{
  role:string,
  workflowStatus:string[]
}