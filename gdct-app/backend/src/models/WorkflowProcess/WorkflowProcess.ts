import { Schema, model } from 'mongoose';
import { WorkflowProcessDoc } from '../../types/workflowprocess';

const { ObjectId } = Schema.Types;

const WorkflowProcessModel = model<WorkflowProcessDoc>(
  'WorkflowProcess',
  new Schema<WorkflowProcessDoc>(
    {
      workflowId: { type: ObjectId, ref: 'Workflow' },
      statusId: { type: ObjectId, ref: 'Status' },
      to: [{ type: ObjectId, ref: 'WorkflowProcess' }],
      position: {
        type: Object,
        default: {
          x: 100,
          y: 100,
        },
      },
    },
    { minimize: false, autoIndex: true },
  ),
  'WorkflowProcess',
);

export default WorkflowProcessModel;
