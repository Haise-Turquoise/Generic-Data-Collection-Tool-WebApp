import { ObjectId } from "mongodb";
import { SubmissionDoc } from "../../types/submission";

export default class SubmissionEntity {
  public _id: ObjectId;
  public id: number;
  public name: string;
  public orgId: number;
  public templateId: ObjectId;
  public templatePackageId: ObjectId;
  public submittedDate: Date;
  public programId: ObjectId;
  public workbookData: any;
  public workflowProcessId: ObjectId|null;
  public workflowId: ObjectId;
  public statusId: ObjectId;
  public year: string;
  public submissionPeriodId: ObjectId;
  public createdAt: Date;
  public updatedAt: Date;
  public updatedBy: ObjectId;
  public isPublished: boolean;
  public version: number;
  public isLatest: boolean;
  public parentId: ObjectId;

  constructor({
    _id,
    id,
    name,
    orgId,
    templateId,
    templatePackageId,
    submittedDate,
    programId,
    workbookData,
    workflowProcessId,
    workflowId,
    statusId,
    year,
    submissionPeriodId,
    createdAt,
    updatedAt,
    updatedBy,
    isPublished,
    version,
    isLatest,
    parentId,
  }: SubmissionDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.orgId = orgId;
    this.templateId = templateId;
    this.templatePackageId = templatePackageId;
    this.programId = programId;
    this.workbookData = workbookData;
    this.submittedDate = submittedDate;
    this.year = year;
    this.submissionPeriodId = submissionPeriodId;
    this.statusId = statusId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.workflowProcessId = workflowProcessId;
    this.workflowId = workflowId;
    this.isPublished = isPublished;
    this.version = version;
    this.isLatest = isLatest;
    this.parentId = parentId;
   }
}
