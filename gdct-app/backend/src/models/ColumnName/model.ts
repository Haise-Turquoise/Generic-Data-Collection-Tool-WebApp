import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';
import { AttributeDoc as Attribute } from '../../types/attribute';

const ColumnNameModel = model<Attribute>(
  'Attribute',
  new Schema<Attribute>(
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
