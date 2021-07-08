import { Schema, model } from 'mongoose';
import { SubmissionPhaseDoc } from '../../types/submissionphase';

const SubmissionPhase = new Schema<SubmissionPhaseDoc>(
  {
    name: { type: String },
    description: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, autoIndex: true },
)

SubmissionPhase.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const SubmissionPhaseModel = model<SubmissionPhaseDoc>('SubmissionPhase', SubmissionPhase, 'SubmissionPhase');

export default SubmissionPhaseModel;
