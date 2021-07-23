import { ObjectId } from "mongodb";
import { WorkflowDoc } from "../../types/workflow";

export default class WorkflowEntity {
  public _id: ObjectId;
  public name: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, name, timestamp, updatedBy, isActive }: WorkflowDoc) {
    this._id = _id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
