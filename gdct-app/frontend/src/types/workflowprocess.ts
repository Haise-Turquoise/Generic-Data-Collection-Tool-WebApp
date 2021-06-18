export default interface WorkflowProcess {
  _id: string,
  to: string[],
  position: { x: number, y: number },
  workflowId: string,
  statusId: string,
  __v?: number
}