import { Schema, model } from 'mongoose';

const Workflow = new Schema(
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
  this.find({ isActive: { $ne: false } });
  next();
});

const WorkflowModel = model('Workflow', Workflow, 'Workflow');

export default WorkflowModel;
