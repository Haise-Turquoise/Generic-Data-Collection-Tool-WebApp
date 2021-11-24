import { Schema, model, Model, CallbackError } from 'mongoose';
import { TemplateTypeDoc } from '../../types/templatetype';

const { ObjectId } = Schema.Types;

const TemplateType = new Schema<TemplateTypeDoc>(
  {
    name: { type: String },
    description: { type: String },
    templateWorkflowId: { type: ObjectId, ref: 'Workflow' },
    submissionWorkflowId: { type: ObjectId, ref: 'Workflow' },
    programId: [{ type: ObjectId, ref: 'Program' }],
    isApprovable: { type: Boolean },
    isReviewable: { type: Boolean },
    isSubmittable: { type: Boolean },
    isInputtable: { type: Boolean },
    isViewable: { type: Boolean },
    isReportable: { type: Boolean },
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, timestamps: true },
)


const TemplateTypeModel = model<TemplateTypeDoc>('TemplateType', TemplateType, 'TemplateType');

export default TemplateTypeModel;
