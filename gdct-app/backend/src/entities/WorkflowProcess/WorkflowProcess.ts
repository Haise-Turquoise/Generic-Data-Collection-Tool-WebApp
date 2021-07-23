import { ObjectId } from "mongodb";
import { WorkflowProcessDoc } from "../../types/workflowprocess";

export default class WorkflowProcessEntity {
  public _id: ObjectId;
  public workflowId: ObjectId;
  public statusId: ObjectId;
  public to: ObjectId[];
  public position: WorkflowProcessDoc["position"]

  constructor({ _id, workflowId, statusId, to, position }: WorkflowProcessDoc) {
    this._id = _id;
    this.workflowId = workflowId;
    this.statusId = statusId;
    this.to = to;
    this.position = position;
  }
}
