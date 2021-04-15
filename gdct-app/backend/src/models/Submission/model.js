import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const SubmissionModel = model(
  'Submission',
  new Schema(
    {
      id: { type: Number },
      templateId: { type: ObjectId, ref: 'Template' },
      templatePackageId: { type: ObjectId, ref: 'TemplatePackage' },

      name: { type: String },

      orgId: { type: Number, ref: 'Organization' },
      programId: { type: ObjectId, ref: 'Program' },

      submittedDate: { type: Date, default: Date.now },

      workbookData: { type: Object },
      workflowProcessId: { type: ObjectId },
      workflowId: { type: ObjectId },
      // phase: { type: String, default: 'edit' },
      statusId: { type: ObjectId, ref: 'Status' },
      year: { type: String },
      submissionPeriodId: { type: ObjectId },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      updatedBy: { type: ObjectId },
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
