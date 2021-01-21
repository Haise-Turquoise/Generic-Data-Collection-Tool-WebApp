import { Schema, model } from 'mongoose';

const { ObjectId, Number } = Schema.Types;

/**
 * Contains the values of successfully approved workbooks
 *
 * Example:
 * {
 *   organizationCode: '995',
 *   sectorName: 'Health',
 *   year: 2010,
 *   quarter: '4',
 *   ...
 * }
 *
 * Since this is a very general schema, we can optimize this by index optimization to:
 *
 * {
 *   $_sectorName_: {
 *     $_organizationCode_: {
 *       $_year_ : {
 *         attributePosition: $_attributePosition_,
 *         categoryPosition: $_cateogryPosition_,
 *         ..._otherOptionals_...,
 *         quarter: $_quarter_
 *       }
 *     }
 *   }
 * }
 *
 * This is just one example of indexing and is not fully optimized or researched.
 * However, it is much more efficient than a flat list due to the fact that it acts as a multi-layer map and reduces the search results on every index layer.
 */
const MasterValueModel = model(
  'MasterValue',
  new Schema(
    {
      submission: {
        _id: { type: ObjectId, ref: 'Submission' },
        name: { type: String },
      },
      // sheet: {
      //   _id: { type: ObjectId, ref: 'Sheet' },
      //   name: { type: String },
      // },
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
        _id: { type: ObjectId, ref: 'Template' },
        name: { type: String },
      },

      COATreeId: { type: ObjectId, ref: 'CategoryTree' },
      categoryId: { type: String},
      attributeId: { type: String },
      categoryGroup: { type: String },

      value: { type: Number },
      categoryName: {type: String},
      attributeName: {type: String},
    },
    { minimize: false },
  ),
  'MasterValue',
);

export default MasterValueModel;
