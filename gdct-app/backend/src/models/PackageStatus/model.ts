import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';
import { PackageStatusDoc } from '../../types/packagestatus';

const PackageStatusModel = model<PackageStatusDoc>(
  'PackageStatus',
  new Schema<PackageStatusDoc>(
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
        updatedDate: String,
        updatedBy: String,
      }
    },
    { minimize: false, autoIndex: true },
  ),
  'PackageStatus4',
);

export default PackageStatusModel;
