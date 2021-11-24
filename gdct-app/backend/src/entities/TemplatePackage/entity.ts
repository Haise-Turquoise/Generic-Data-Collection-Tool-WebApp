import { ObjectId } from "mongodb";
import { TemplatePackageDoc } from "../../types/templatepackage";

export default class TemplatePackageEntity {
  public _id: ObjectId;
  public name: string;
  public submissionPeriodId: ObjectId;
  public templateIds: ObjectId[];
  public statusId: ObjectId;
  public creationDate: Date;
  public userCreatorId: ObjectId;
  public programIds: ObjectId[];
  public updatedAt: Date;
  public updatedBy: string;
  public deadline: string;

  constructor({
    _id,
    name,
    submissionPeriodId,
    templateIds,
    statusId,
    creationDate,
    userCreatorId,
    programIds,
    updatedAt,
    updatedBy,
    deadline
  }: TemplatePackageDoc) {
    this._id = _id;
    this.name = name;
    this.submissionPeriodId = submissionPeriodId;
    this.templateIds = templateIds;
    this.statusId = statusId;
    this.creationDate = creationDate;
    this.userCreatorId = userCreatorId;
    this.programIds = programIds;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deadline = deadline;
  }
}
