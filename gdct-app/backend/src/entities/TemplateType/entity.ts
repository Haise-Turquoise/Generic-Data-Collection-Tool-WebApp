import { ObjectId } from "mongodb";
import { TemplateTypeDoc } from "../../types/templatetype";

export default class TemplateTypeEntity {
  public _id: string;
  public name: string;
  public description: string;
  public templateWorkflowId: ObjectId;
  public submissionWorkflowId: ObjectId;
  public programIds: ObjectId[];
  public isApprovable: boolean;
  public isReviewable: boolean;
  public isSubmittable: boolean;
  public isInputtable: boolean;
  public isViewable: boolean;
  public isReportable: boolean;
  public timestamp: Date;
  public updatedBy: string;
  public updatedAt: Date;
  public isActive: boolean;

  constructor({
    _id,
    name,
    description,
    templateWorkflowId,
    submissionWorkflowId,
    programIds,
    isApprovable,
    isReviewable,
    isSubmittable,
    isInputtable,
    isViewable,
    isReportable,
    timestamp,
    updatedBy,
    isActive,
    updatedAt,
  }: TemplateTypeDoc) {
    this._id = _id;
    this.name = name;
    this.templateWorkflowId = templateWorkflowId;
    this.submissionWorkflowId = submissionWorkflowId;
    this.description = description;
    this.programIds = programIds;
    this.isApprovable = isApprovable;
    this.isReviewable = isReviewable;
    this.isSubmittable = isSubmittable;
    this.isInputtable = isInputtable;
    this.isViewable = isViewable;
    this.isReportable = isReportable;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
    this.updatedAt = updatedAt;
  }
}
