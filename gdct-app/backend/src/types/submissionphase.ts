import { Document } from "mongoose";

export default interface SubmissionPhase {
  name: string;
  description: string;
  isActive: boolean;
}

export interface SubmissionPhaseDoc extends SubmissionPhase, Document {}
