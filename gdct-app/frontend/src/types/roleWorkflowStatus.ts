export default interface RoleWorkflowStatus{
  _id?:string,
  role:string,
  workflowStatus:string[],
  updatedBy: string,
  modifiedOn: string,
}