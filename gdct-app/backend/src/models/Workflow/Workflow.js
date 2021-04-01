import { Schema, model } from 'mongoose';

const WorkflowModel = model(
  'Workflow',
  new Schema(
    {
      name: { type: String },
      timestamp: { type: Date, default: Date.now },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
      isActive: {
        type: Boolean,
        default: true,
        select: false,
      },
    },
    { minimize: false, autoIndex: true },
  ),
  'Workflow',
);

export default WorkflowModel;
