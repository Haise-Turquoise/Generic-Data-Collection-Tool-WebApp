import { ObjectId } from "mongodb";
import { TemplateDoc } from "../../types/template";

// It's possible that we can extend an object for all entity classes
export default class TemplateEntity {
  public _id: ObjectId;
  public name: string;
  public templateData: any[];
  public templateTypeId: ObjectId;
  public userCreatorId: ObjectId;
  public creationDate: Date;
  public expirationDate: Date;
  public workflowProcessId: ObjectId;
  public timestamp: Date;
  public updatedBy: string;

  constructor({
    _id,
    name,
    templateData,
    templateTypeId,
    userCreatorId,
    creationDate,
    expirationDate,
    workflowProcessId,
    timestamp,
    updatedBy,
  }: TemplateDoc) {
    this._id = _id;
    this.name = name;
    this.templateData = templateData;
    this.templateTypeId = templateTypeId;
    this.userCreatorId = userCreatorId;
    this.creationDate = creationDate;
    this.expirationDate = expirationDate;
    this.workflowProcessId = workflowProcessId;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
