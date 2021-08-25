import { Document, Model } from 'mongoose';
import { ObjectId } from "mongodb";
export default interface TemplateType {
  _id: string;
  name: string;
  description: string;
  templateWorkflowId: ObjectId;
  submissionWorkflowId: ObjectId;
  programIds: ObjectId[];
  isApprovable: boolean;
  isReviewable: boolean;
  isSubmittable: boolean;
  isInputtable: boolean;
  isViewable: boolean;
  isReportable: boolean;
  updatedAt: Date;
  updatedBy: string;
  isActive: boolean;
}

export interface TemplateTypeDoc extends TemplateType, Document {
  _id: string;
}
