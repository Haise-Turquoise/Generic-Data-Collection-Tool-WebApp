import { Schema, model, Model, CallbackError } from 'mongoose';
import { ProgramDoc } from '../../types/program';

const Program = new Schema<ProgramDoc>(
  {
    id: {type: Number},
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    timestamp: { type: Date },
    updatedBy: { type: String },
    isActive: { type: Boolean },
  },
  { minimize: false, timestamps: true },
)

const ProgramModel = model<ProgramDoc>('Program', Program, 'Program');

export default ProgramModel;
