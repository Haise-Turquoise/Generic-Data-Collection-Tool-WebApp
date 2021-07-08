import { Schema, model } from 'mongoose';
import { DataResumeDoc } from '../../types/dataresume';

const DataResumeModel = model<DataResumeDoc>(
  'DataResume',
  new Schema<DataResumeDoc>(
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