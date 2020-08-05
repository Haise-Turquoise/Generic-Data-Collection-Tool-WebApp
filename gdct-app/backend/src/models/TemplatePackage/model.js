import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const TemplatePackageModel = model(
  'TemplatePackage',
  new Schema(
    {
      name: { type: String },
      submissionPeriodId: { type: ObjectId, ref: 'SubmissionPeriod' },
      statusId: { type: ObjectId, ref: 'Status' },
      templateIds: [{ type: ObjectId, ref: 'Template' }],
      creationDate: { type: Date, default: Date.now },
      userCreatorId: { type: ObjectId, ref: 'User' },
      programIds: [{ type: ObjectId, ref: 'Program' }],
    },
    { minimize: false, autoIndex: true },
  ),
  'TemplatePackage',
);

export default TemplatePackageModel;
