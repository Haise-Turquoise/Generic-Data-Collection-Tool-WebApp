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
      creationDate: { type: Date },
      expirationDate: { type: Date },
      statusId:{ type:ObjectId, ref:'Status'},
      googleSheetId: { type: ObjectId, ref: 'GoogleSheet' },
      timestamp: { type: Date },
      updatedBy: { type: String },
    },
    { minimize: false, timestamps: true },
  ),
  'Template',
);

export default TemplateModel;
