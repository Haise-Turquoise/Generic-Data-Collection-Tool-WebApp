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
