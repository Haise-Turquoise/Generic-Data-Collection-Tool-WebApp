import { Schema, model } from 'mongoose';
import { TemplateTypeDoc } from '../../types/templatetype';

const { ObjectId } = Schema.Types;

const TemplateType = new Schema<TemplateTypeDoc>(
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
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, timestamps: true },
)

TemplateType.pre(/^find/, function (next) {
  //@ts-ignore unsure about this
  this.find({ isActive: { $ne: false } });
  next();
});

const TemplateTypeModel = model<TemplateTypeDoc>('TemplateType', TemplateType, 'TemplateType');

export default TemplateTypeModel;
