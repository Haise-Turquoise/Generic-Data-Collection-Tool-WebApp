import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export default interface SubmissionPeriod {
  _id:ObjectId
  reportingPeriodId: ObjectId,
  name: string,
  startDate: string,
  endDate: string,
  updatedAt: string,
  updatedBy: string,
  programId: ObjectId[];
}

export interface SubmissionPeriodDoc extends SubmissionPeriod, Document {
  _id:ObjectId
}
