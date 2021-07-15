import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export default interface SubmissionPeriod {
  reportingPeriodId: ObjectId,
  name: string,
  startDate: Date,
  endDate: Date,
  timestamp: Date,
  updatedBy: string,
  programId: ObjectId[];
}

export interface SubmissionPeriodDoc extends SubmissionPeriod, Document {}
