import { Schema, model, Model, CallbackError } from 'mongoose';
import { SubmissionPhaseDoc } from '../../types/submissionphase';

const SubmissionPhase = new Schema<SubmissionPhaseDoc>(
  {
    name: { type: String },
    description: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, autoIndex: true },
)

SubmissionPhase.pre(/^find/, function (this: Model<SubmissionPhaseDoc>, next: (err: CallbackError) => void) {
  this.find({ isActive: { $ne: false } });
  next(null);
});

const SubmissionPhaseModel = model<SubmissionPhaseDoc>('SubmissionPhase', SubmissionPhase, 'SubmissionPhase');

export default SubmissionPhaseModel;
