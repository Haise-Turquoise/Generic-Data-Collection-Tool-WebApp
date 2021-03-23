import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';

const ColumnNameModel = model(
  'Attribute',
  new Schema(
    {
      name: { type: String, required: true },
      id: { type: String, required: true, unique: true },
      timestamp: { type: Date },
      //    userCreatorId: { type: ObjectId, ref: 'User' },
      updatedBy: { type: String },
    },
    { minimize: false },
  ),
  'Attribute',
);

export default ColumnNameModel;
