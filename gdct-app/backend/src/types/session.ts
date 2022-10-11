import { Document } from 'mongoose';

export default interface Session {
  _id: string;
  expires: Date;
  session: string;
}

export interface SessionDoc extends Session, Document {
  _id: string;
}
