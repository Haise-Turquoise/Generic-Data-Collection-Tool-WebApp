import { Schema, model } from 'mongoose';

const ProgramModel = model(
  'Program',
  new Schema(
    {
      name: { type: String, required: true },
      code: { type: String, required: true, unique: true },
      timestamp: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
      isActive: { type: Boolean },
    },
    { minimize: false, timestamps: true },
  ),
  'Program',
);

export default ProgramModel;
