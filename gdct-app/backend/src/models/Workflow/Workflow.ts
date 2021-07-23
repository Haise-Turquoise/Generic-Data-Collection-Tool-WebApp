import { Schema, model, Model, CallbackError } from 'mongoose';
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

Workflow.pre(/^find/, function (this: Model<WorkflowDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const WorkflowModel = model<WorkflowDoc>('Workflow', Workflow, 'Workflow');

export default WorkflowModel;
