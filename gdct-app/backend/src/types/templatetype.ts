import { ObjectId, Document, Model } from "mongoose";

export default interface TemplateType {
  name: string,
  description: string,
  templateWorkflowId: ObjectId,
  submissionWorkflowId: ObjectId,
  programIds: ObjectId[],
  isApprovable: boolean,
  isReviewable: boolean,
  isSubmittable: boolean,
  isInputtable: boolean,
  isViewable: boolean,
  isReportable: boolean,
  timestamp: Date,
  updatedBy: string,
  isActive: boolean,
}

export interface TemplateTypeDoc extends TemplateType, Document {}

export interface TemplateTypeModel extends Model<TemplateTypeDoc> {}
