import { Document } from 'mongoose';

export default interface RoleWorkflowStatus{
  role:string,
  workflowStatus:string[],
}

export interface RoleWorkflowStatusDoc extends RoleWorkflowStatus, Document { }