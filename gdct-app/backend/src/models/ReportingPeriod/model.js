import { Schema, model } from 'mongoose';

const ReportingPeriodModel = model(
  'ReportingPeriod',
  new Schema(
    {
      name: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      application: { type: String },
      code: { type: String },
      submissionClosed: { type: Boolean },
      timestamp: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'ReportingPeriod',
);

export default ReportingPeriodModel;
