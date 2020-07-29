import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const TemplateModel = model(
  'Template',
  new Schema(
    {
      name: { type: String },

      templateData: { type: Object },

      templateTypeId: { type: ObjectId, ref: 'TemplateType' },

      userCreatorId: { type: ObjectId, ref: 'User' },

      creationDate: { type: Date },

      expirationDate: { type: Date },

      statusId: { type: ObjectId, ref: 'Status' },
    },
    { minimize: false },
  ),
  'Template',
);

export default TemplateModel;
