import { Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

const TemplateModel = model(
  'Template',
  new Schema(
    {
      name: { type: String },

      workflowId: { type: ObjectId, ref: 'Workflow' },
      workflowProcessId: { type: ObjectId, ref: 'WorkflowProcess' },

      templateData: { type: Object },

      templateTypeId: { type: ObjectId, ref: 'TemplateType' },

      userCreatorId: { type: ObjectId, ref: 'User' },
      creationDate: { type: Date },
      expirationDate: { type: Date },

      googleSheetId: { type: ObjectId, ref: 'GoogleSheet' },
    },
    { minimize: false, timestamps: true },
  ),
  'Template',
);

export default TemplateModel;
