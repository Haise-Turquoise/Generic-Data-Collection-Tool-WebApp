import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const SubmissionNoteModel = model(
  'SubmissionNote',
  new Schema(
    {
      id: { type: Number },
      note: { type: String },
      submissionId: { type: ObjectId, ref: 'Submission' },
      updatedDate: { type: Date },
      userCreatorId: { type: ObjectId, ref: 'User' },
      role: { type: String },
    },
    { minimize: false, autoIndex: true },
  ),
  'SubmissionNote',
);

export default SubmissionNoteModel;
