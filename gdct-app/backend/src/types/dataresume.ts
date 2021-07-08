import { Document } from "mongoose";

export default interface DataResume {
  resumeArray: any[],
  currentCount: number,
  totalCount: number,
}

export interface DataResumeDoc extends DataResume, Document {}