import { Schema, model } from 'mongoose';
import { SubmissionPeriodDoc } from '../../types/submissionperiod';
const { ObjectId } = Schema.Types;

const SubmissionPeriodModel = model<SubmissionPeriodDoc>(
  'SubmissionPeriod',
  new Schema<SubmissionPeriodDoc>(
    {
      reportingPeriodId: { type: ObjectId, ref: 'ReportingPeriod' },
      programId: [{ type: ObjectId, ref: 'Program' }],
      name: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      timestamp: { type: Date },
      updatedBy: { type: String },
      updatedAt: {type: String},
    },
    { minimize: false, autoIndex: true },
  ),
  'SubmissionPeriod',
);

export default SubmissionPeriodModel;
