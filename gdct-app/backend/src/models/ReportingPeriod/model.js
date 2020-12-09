import { Schema, model } from 'mongoose';

const ReportingPeriodModel = model(
  'ReportingPeriod',
  new Schema(
    {
      name: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      application: { type: String },
      code: { type: Number },
      submissionClosed: { type: Boolean }
    },
    { minimize: false },
  ),
  'ReportingPeriod',
);

export default ReportingPeriodModel;
