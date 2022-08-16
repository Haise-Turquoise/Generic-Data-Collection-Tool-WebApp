import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
export default interface Counter {
  _id: ObjectId;
  name: string;
  coll: string;
  incr: number;
}

export interface CounterDoc extends Counter, Document {
  _id: ObjectId;
  id: string;
}
