import { Schema, model } from 'mongoose';
import { ProgramDoc } from '../../types/program';

const Program = new Schema<ProgramDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, timestamps: true },
)

Program.pre(/^find/, function (next) {
  //@ts-ignore
  this.find({ isActive: { $ne: false } });
  next();
});

const ProgramModel = model<ProgramDoc>('Program', Program, 'Program');

export default ProgramModel;
