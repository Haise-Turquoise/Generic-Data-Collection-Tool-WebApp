import { ObjectId } from "mongodb";
import { TemplateDoc } from "../../types/template";

// It's possible that we can extend an object for all entity classes
export default class TemplateEntity {
  public _id: ObjectId | undefined;
  public name: string;
  public templateData: any[];
  public templateTypeId: ObjectId;
  public userCreatorId: ObjectId;
  public creationDate: string;
  public expirationDate: string;
  public workflowProcessId: ObjectId;
  public updatedAt: string;
  public updatedBy: string;
  public createdAt: string;

  constructor({
    _id,
    name,
    templateData,
    templateTypeId,
    userCreatorId,
    creationDate,
    expirationDate,
    workflowProcessId,
    updatedAt,
    updatedBy,
    createdAt,
  }: TemplateDoc) {
    this._id = _id;
    this.name = name;
    this.templateData = templateData;
    this.templateTypeId = templateTypeId;
    this.userCreatorId = userCreatorId;
    this.creationDate = creationDate;
    this.expirationDate = expirationDate;
    this.workflowProcessId = workflowProcessId;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.createdAt = createdAt;
  }
}
