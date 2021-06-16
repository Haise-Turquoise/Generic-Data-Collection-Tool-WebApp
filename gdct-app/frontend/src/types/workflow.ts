export default interface Workflow {
  _id: string,
  isActive: boolean,
  name: string,
  timestamp: string,
  updatedBy: string,
  __v?: number,
}