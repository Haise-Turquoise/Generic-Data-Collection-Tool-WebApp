import { Document } from "mongoose";

export default interface DataResume {
  _id: string,
  resumeArray: any[],
  currentCount: number,
  totalCount: number,
}

export interface DataResumeDoc extends DataResume, Document {
  _id: string,
}