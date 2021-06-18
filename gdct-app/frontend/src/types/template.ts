export default interface Template {
  _id: string,
  templateData?: {[key: string]: any}[],
  name: string,
  templateTypeId: string,
  workflowProcessId: string,
  updatedBy: string,
  timestamp: string,
  createdAt: string,
  updatedAt: string,
  __v?: number,
}