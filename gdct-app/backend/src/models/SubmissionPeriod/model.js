import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const SubmissionPeriodModel = model(
  'SubmissionPeriod',
  new Schema(
    {
      reportingPeriodId: { type: ObjectId, ref: 'ReportingPeriod' },
      programId: { type: ObjectId, ref: 'Program' },
      name: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      timestamp: { type: Date },
      updatedBy: { type: String },
    },
    { minimize: false, autoIndex: true },
  ),
  'SubmissionPeriod',
);

export default SubmissionPeriodModel;
