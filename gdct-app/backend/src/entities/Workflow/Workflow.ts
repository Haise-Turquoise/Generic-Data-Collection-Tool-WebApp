import { ObjectId } from "mongodb";
import { WorkflowDoc } from "../../types/workflow";

export default class WorkflowEntity {
  public _id: ObjectId;
  public name: string;
  public updatedAt: string;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, name, updatedAt, updatedBy, isActive }: WorkflowDoc) {
    this._id = _id;
    this.name = name;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
