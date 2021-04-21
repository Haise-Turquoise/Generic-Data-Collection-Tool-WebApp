import { Schema, model } from 'mongoose';

const SessionModel = model(
  'Session',
  new Schema(
    {
      _id: { type: String },
      expires: { type: Date },
      session: { type: String },
    },
    { minimize: false },
  ),
  'sessions',
);

export default SessionModel;
