import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const WorkflowProcessModel = model(
  'WorkflowProcess',
  new Schema(
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
