export default class WorkflowProcessEntity {
  constructor({ _id, workflowId, statusId, to, position }) {
    this._id = _id;
    this.workflowId = workflowId;
    this.statusId = statusId;
    this.to = to;
    this.position = position;
  }
}
