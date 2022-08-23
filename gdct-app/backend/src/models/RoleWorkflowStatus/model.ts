import { Schema, model } from 'mongoose';
import { RoleWorkflowStatusDoc } from '../../types/RoleWorkflowStatus';


// Created by Sheldon on 2021/07/13
// model for RoleWorkflowStatus
const RoleWorkflowStatusModel = model<RoleWorkflowStatusDoc>('RoleWorkflowStatus',
  new Schema<RoleWorkflowStatusDoc>(
    {
      role:{type: String},
      workflowStatus:{type: Array},
      updatedBy: String,
      modifiedOn: String,
    },
    { minimize: false },
  ),
  'RoleWorkflowStatus'
)

export default RoleWorkflowStatusModel;