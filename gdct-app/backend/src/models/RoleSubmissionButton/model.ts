import { Schema, model } from 'mongoose';

import { RoleSubmissionButtonDoc } from '../../types/rolesubmissionbutton';


// Created by Jie on 2021/07/29
// model for RoleSubmissionButton
const RoleSubmissionButtonModel = model<RoleSubmissionButtonDoc>('RoleSubmissionButton',
  new Schema<RoleSubmissionButtonDoc>(
    {
      role:{type: String},
      button:{type: Array}
    },
    { minimize: false },
  ),
  'RoleSubmissionButton'
)

export default RoleSubmissionButtonModel;