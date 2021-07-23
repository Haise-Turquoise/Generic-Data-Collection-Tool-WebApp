import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';
import { SubmissionStatusDoc } from '../../types/packagestatus';

const SubmissionStatusModel = model<SubmissionStatusDoc>(
  'PackageStatus',
  new Schema<SubmissionStatusDoc>(
    {
      name: String,
      org: {
        id: Number,
        name: String,
      },
      template: {
        name: String,
      },
      submission: {
        _id: ObjectId,
        name: String,
      },
      subIndex: Number,
      program: {
        code: String,
        name: String,
      },
      status: {
        name: String,
      },
      submissionPeriod: {
        name: String,
      },
      templateType: {
        name: String,
      },
      submissionNote: {
        submissionId: ObjectId,
        updatedDate: String,
        updatedBy: String,
      }
    },
    { minimize: false, autoIndex: true },
  ),
  'SubmissionStatus',
);

export default SubmissionStatusModel;
