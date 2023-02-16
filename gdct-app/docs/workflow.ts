type IWorkflowProcessId = number
type ISubmissionId = number
type IWorkflowId = number
type IStatusId = number
type IAppSysId = number
type IWorkflowPhaseId = number
type IWorkflowProcessAuthorizationId = number

interface ISubmissionComments {
  submissionId: ISubmissionId
  workflowProcessId: IWorkflowProcessId
  value: string // or comment id if this table acts as a bridge instead
}

interface ISubmission {
  workflowId: IWorkflowId
  currentWorkflowProcessId: IWorkflowProcessId
  workflowProcessIdHistory: Array<IWorkflowProcessId>
}

interface IWorkflowPhase {
  name: string
}

// Non transition workflow data
// workflow and workflowProcess represents the entire workflow structure
// They're separated to normalize data
interface IWorkflow {
  name: string
}

// Workflow phase transitions
interface IWorkflowProcess {
  workflowId: IWorkflowId           
  workflowPhaseId: IWorkflowPhaseId, 
  to: Array<IWorkflowProcessId>,     // Next potential states
}

interface IWorkflowProcessAuthorization  {
  workflowProcessId: IWorkflowProcess
  appSysRoleId: IAppSysId            // Permissions - required to access this phase
}