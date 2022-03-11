import { Schema, model } from 'mongoose';
import { ReportingPeriodDoc } from '../../types/reportingperiod';

const ReportingPeriodModel = model<ReportingPeriodDoc>(
  'ReportingPeriod',
  new Schema<ReportingPeriodDoc>(
    {
      name: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      application: { type: String },
      code: { type: String },
      submissionClosed: { type: Boolean },
      timestamp: { type: Date },
      updatedBy: { type: String },
      updatedAt: { type: String },
    },
    { minimize: false },
  ),
  'ReportingPeriod',
);

export default ReportingPeriodModel;
