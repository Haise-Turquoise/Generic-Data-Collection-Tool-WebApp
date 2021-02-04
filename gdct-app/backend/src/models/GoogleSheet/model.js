import { Schema, model } from 'mongoose';

const { ObjectId, Number} = Schema.Types;

const GoogleSheetModel = model(
  'GoogleSheet',
  new Schema(
    {
      duplicateId: { type: String },
      googleSheetId: { type: String },
      templateId: { type: ObjectId, ref: 'Template' },
      submissionId: { type: ObjectId, ref: 'Submission' },
      triggerId: { type: String },
      previewCoord: [],
    },
    { minimize: false },
  ),
  'GoogleSheet',
);

export default GoogleSheetModel;

//   const data = []
//   // data will be of the format
//   // {
//   //   row: {
//           // start,
//           // end,
//   //   },
//   //   column,
//   //   sheet,
//   // }
//   let request = {
//     'method' : 'post',
//     'payload' : data,
//   };
//   const res = UrlFetchApp.fetch('http://99.250.166.140:3000/organizations/orgWithMasterValueEntry', request);
// }