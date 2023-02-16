import { Schema, model } from 'mongoose';
import { TemplateDoc } from '../../types/template';

const { ObjectId } = Schema.Types;

const TemplateModel = model<TemplateDoc>(
  'Template',
  new Schema<TemplateDoc>(
    {
      name: { type: String },

      workflowId: { type: ObjectId, ref: 'Workflow' },
      workflowProcessId: { type: ObjectId, ref: 'WorkflowProcess' },

      templateData: { type: Array },

      templateTypeId: { type: ObjectId, ref: 'TemplateType' },

      userCreatorId: { type: ObjectId, ref: 'User' },
      creationDate: { type: String },
      createdAt: {type: String},
      updatedAt: {type: String},
      expirationDate: { type: String },
      statusId:{ type:ObjectId, ref:'Status'},
      googleSheetId: { type: ObjectId, ref: 'GoogleSheet' },
      timestamp: { type: String },
      updatedBy: { type: String },
    },
    { minimize: false, timestamps: true },
  ),
  'Template',
);

export default TemplateModel;
