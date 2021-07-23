import { Schema, model } from 'mongoose';
import { SubmissionNoteDoc } from '../../types/submissionnote';

const { ObjectId } = Schema.Types;

const SubmissionNoteModel = model<SubmissionNoteDoc>(
  'SubmissionNote',
  new Schema<SubmissionNoteDoc>(
    {
      id: { type: Number },
      note: { type: String },
      submissionId: { type: ObjectId, ref: 'Submission' },
      updatedDate: { type: Date },
      userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
      role: { type: String },
    },
    { minimize: false, autoIndex: true },
  ),
  'SubmissionNote',
);

export default SubmissionNoteModel;
