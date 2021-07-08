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
  public timestamp: Date;
  public updatedBy: string;

  constructor({
    _id,
    name,
    submissionPeriodId,
    templateIds,
    statusId,
    creationDate,
    userCreatorId,
    programIds,
    timestamp,
    updatedBy,
  }: TemplatePackageDoc) {
    this._id = _id;
    this.name = name;
    this.submissionPeriodId = submissionPeriodId;
    this.templateIds = templateIds;
    this.statusId = statusId;
    this.creationDate = creationDate;
    this.userCreatorId = userCreatorId;
    this.programIds = programIds;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
