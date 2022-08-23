import { Schema, model } from 'mongoose';
import { TemplatePackageDoc } from '../../types/templatepackage';

const { ObjectId } = Schema.Types;

const TemplatePackageModel = model<TemplatePackageDoc>(
  'TemplatePackage',
  new Schema<TemplatePackageDoc>(
    {
      name: { type: String },
      submissionPeriodId: { type: ObjectId, ref: 'SubmissionPeriod' },
      statusId: { type: ObjectId, ref: 'Status' },
      templateIds: [{ type: ObjectId, ref: 'Template' }],
      creationDate: { type: String },
      userCreatorId: { type: ObjectId, ref: 'User' },
      programIds: [{ type: ObjectId, ref: 'Program' }],
      forPackage: { type: Boolean, ref: 'ForPackage' },
      timestamp: { type: Date },
      updatedAt: { type: String },
      updatedBy: { type: String },
      deadline: {type: String, default: null}
    },
    { minimize: false, autoIndex: true },
  ),
  'TemplatePackage',
);

export default TemplatePackageModel;
