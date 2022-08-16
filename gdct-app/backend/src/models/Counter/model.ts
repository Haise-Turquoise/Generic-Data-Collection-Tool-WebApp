import { Schema, model } from 'mongoose';
import { CounterDoc as Counter } from '../../types/counter';
import { ObjectId } from 'mongodb';

const Counter = model<Counter>(
  'Counter',
  new Schema<Counter>(
    {
      _id: {type: ObjectId},    
      coll: {type: String},
      name: {type: String},
      incr: {type: Number}
    },
    { minimize: false },
  ),
  'Counter',
);

export default Counter; 