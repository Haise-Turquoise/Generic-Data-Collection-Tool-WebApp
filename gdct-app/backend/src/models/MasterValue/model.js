import { Schema, model } from 'mongoose';

const { ObjectId, Number } = Schema.Types;

const MasterValueModel = model(
  'MasterValue',
  new Schema(
    {
      submission: {
        _id: { type: ObjectId, ref: 'Submission' },
        name: { type: String },
      },
      reportingPeriod: { type: String, default: '' },
      program: {
        _id: { type: ObjectId, ref: 'Program' },
        name: { type: String },
      },
      org: {
        id: { type: Number, ref: 'Org' },
        name: { type: String },
      },
      templateType: {
        _id: { type: ObjectId, ref: 'TemplateType' },
        name: { type: String },
      },
      template: {
        // _id: { type: ObjectId, ref: 'Template' },
        // name: { type: String },
      },

      COATreeId: { type: ObjectId, ref: 'CategoryTree' },
      categoryId: { type: String },
      attributeId: { type: String },
      categoryGroup: { type: String },
      categoryName: { type: String },
      attributeName: { type: String },
      value: { type: Number },
    },
    { minimize: false },
  ),
  'MasterValue',
);

export default MasterValueModel;
