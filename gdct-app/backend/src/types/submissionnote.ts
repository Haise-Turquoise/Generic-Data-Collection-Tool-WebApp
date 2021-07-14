import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface SubmissionNote {
  id: number;
  note: string;
  submissionId: ObjectId;
  updatedDate: Date;
  userCreatorId: ObjectId;
  updatedBy: string;
  role: string;
}

export interface SubmissionNoteDoc extends SubmissionNote, Document {
  id: number,
}
