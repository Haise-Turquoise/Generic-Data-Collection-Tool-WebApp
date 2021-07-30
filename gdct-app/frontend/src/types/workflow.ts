import WorkflowProcess from "./workflowprocess";

export default interface Workflow {
  _id: string;
  isActive: boolean;
  name: string;
  timestamp: string;
  updatedBy: string;
  __v?: number;
}

export interface Node {
  id: string,
  orientation?: number,
  ports: {[key: string]: {id: string, type: string}},
  position: {x: number, y: number},
  properties?: {label: string},
  type: {_id: string, name: string} | string,
}

export interface WorkflowData {
  workflow: Workflow,
  workflowProcessesData: WorkflowProcess[],
  statusData: {
    id: string,
    statusId: string,
    position: {x: number, y: number},
  }[],
}
