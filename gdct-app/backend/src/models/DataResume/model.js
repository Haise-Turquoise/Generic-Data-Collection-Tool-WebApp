import { Schema, model } from 'mongoose';

const DataResumeModel = model(
  'DataResume',
  new Schema(
    {
      
      resumeArray: { type: Array },
      currentCount: {type: Number},
      totalCount: { type: Number },
    },
    { minimize: false },
  ),
  'DataResume',
);

export default DataResumeModel;