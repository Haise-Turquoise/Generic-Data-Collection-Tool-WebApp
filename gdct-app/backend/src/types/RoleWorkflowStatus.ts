import { Document } from 'mongoose';

export default interface RoleWorkflowStatus{
  role:string,
  workflowStatus:string[],
  modifiedOn: string,
  updatedBy: string,
}

export interface RoleWorkflowStatusDoc extends RoleWorkflowStatus, Document { }