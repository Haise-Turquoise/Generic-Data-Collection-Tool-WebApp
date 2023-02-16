import { ObjectId } from "mongodb";
import { TemplateTypeDoc } from "../../types/templatetype";

export default class TemplateTypeEntity {
  public _id: string;
  public name: string;
  public description: string;
  public templateWorkflowId: ObjectId;
  public submissionWorkflowId: ObjectId;
  public programId: ObjectId[];
  public isApprovable: boolean;
  public isReviewable: boolean;
  public isSubmittable: boolean;
  public isInputtable: boolean;
  public isViewable: boolean;
  public isReportable: boolean;
  public updatedAt: string;
  public updatedBy: string;
  public isActive: boolean;

  constructor({
    _id,
    name,
    description,
    templateWorkflowId,
    submissionWorkflowId,
    programId,
    isApprovable,
    isReviewable,
    isSubmittable,
    isInputtable,
    isViewable,
    isReportable,
    updatedAt,
    updatedBy,
    isActive,
  }: TemplateTypeDoc) {
    this._id = _id;
    this.name = name;
    this.templateWorkflowId = templateWorkflowId;
    this.submissionWorkflowId = submissionWorkflowId;
    this.description = description;
    this.programId = programId;
    this.isApprovable = isApprovable;
    this.isReviewable = isReviewable;
    this.isSubmittable = isSubmittable;
    this.isInputtable = isInputtable;
    this.isViewable = isViewable;
    this.isReportable = isReportable;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
