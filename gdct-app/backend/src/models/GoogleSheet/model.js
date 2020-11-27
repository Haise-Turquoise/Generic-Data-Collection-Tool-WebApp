import { Schema, model } from 'mongoose';

const { ObjectId, Number} = Schema.Types;

const GoogleSheetModel = model(
  'GoogleSheet',
  new Schema(
    {
      duplicateId: { type: String },
      googleSheetId: { type: String },
      templateId: { type: ObjectId, ref: 'Template' },
      submissionId: { type: ObjectId, ref: 'Submission' },
      triggerId: { type: String },
    },
    { minimize: false },
  ),
  'GoogleSheet',
);

export default GoogleSheetModel;