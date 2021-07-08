import { Schema, model } from 'mongoose';
import { WorkflowDoc } from '../../types/workflow';

const Workflow = new Schema<WorkflowDoc>(
  {
    name: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { minimize: false, autoIndex: true },
)

Workflow.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const WorkflowModel = model<WorkflowDoc>('Workflow', Workflow, 'Workflow');

export default WorkflowModel;
