import { Schema, model } from 'mongoose';
import { SessionDoc } from '../../types/session';

const SessionModel = model<SessionDoc>(
  'Session',
  new Schema<SessionDoc>(
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
