import { Schema, model } from 'mongoose';

const Program = new Schema(
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
  this.find({ isActive: { $ne: false } });
  next();
});

const ProgramModel = model('Program', Program, 'Program');

export default ProgramModel;
