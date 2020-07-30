import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const TemplateTypeModel = model(
  'TemplateType',
  new Schema(
    {
      name: { type: String },
      description: { type: String },
      templateWorkflowId: { type: ObjectId, ref: 'Workflow' },
      submissionWorkflowId: { type: ObjectId, ref: 'Workflow' },

      programIds: [{ type: ObjectId, ref: 'Program' }],

      isApprovable: { type: Boolean },
      isReviewable: { type: Boolean },
      isSubmittable: { type: Boolean },
      isInputtable: { type: Boolean },
      isViewable: { type: Boolean },
      isReportable: { type: Boolean },
      isActive: { type: Boolean },
    },
    { minimize: false, timestamps: true },
  ),
  'TemplateType',
);

export default TemplateTypeModel;
