import WorkflowProcess from "./workflowprocess";
export default interface VisitedNode extends WorkflowProcess{
    toStatusesName:string[],
    statusName:string,
}