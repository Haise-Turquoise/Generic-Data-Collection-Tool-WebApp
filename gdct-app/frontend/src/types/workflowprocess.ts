import Status from './status';

export default interface WorkflowProcess {
  _id?: string,
  to: string[],
  position: { x: number, y: number },
  workflowId: string,
  statusId: Status,
  __v?: number
}