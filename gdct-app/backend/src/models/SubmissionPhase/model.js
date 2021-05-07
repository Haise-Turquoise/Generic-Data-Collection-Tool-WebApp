import { Schema, model } from 'mongoose';

const SubmissionPhase = new Schema(
  {
    name: { type: String },
    description: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, autoIndex: true },
)

SubmissionPhase.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

const SubmissionPhaseModel = model('SubmissionPhase', SubmissionPhase, 'SubmissionPhase');

export default SubmissionPhaseModel;
