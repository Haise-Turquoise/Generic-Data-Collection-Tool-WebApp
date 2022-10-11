import { Schema, model } from 'mongoose';
import { SubmissionDoc } from '../../types/submission';

const { ObjectId } = Schema.Types;

const SubmissionModel = model<SubmissionDoc>(
  'Submission',
  new Schema<SubmissionDoc>(
    {
      id: { type: Number },
      templateId: { type: ObjectId, ref: 'Template' },
      templatePackageId: { type: ObjectId, ref: 'TemplatePackage' },
      name: { type: String },
      orgId: { type: Number, ref: 'Organization' },
      programId: { type: ObjectId, ref: 'Program' },
      submittedDate: { type: Date, default: Date.now },
      workbookData: { type: Object },
      templateName: { type: String },
      approver: {type: String},
      workflowProcessId: { type: ObjectId, ref: 'WorkflowProcess' },
      workflowId: { type: ObjectId },
      statusId: { type: ObjectId, ref: 'Status' },
      year: { type: String },
      submissionPeriodId: { type: ObjectId, ref: 'SubmissionPeriod' },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      updatedBy: { type: ObjectId, ref: 'User' },
      isPublished: { type: Boolean, default: false },
      version: { type: Number, default: 0 },
      isLatest: { type: Boolean, default: true },
      parentId: { type: ObjectId },
    },
    { minimize: false, timestamps: true },
  ),
  'Submission',
);

export default SubmissionModel;
