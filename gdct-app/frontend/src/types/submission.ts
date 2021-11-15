import Program from "./program";
import Status from "./status";
import SubmissionPeriod from "./submissionperiod";
import User from "./user";
import WorkflowProcess from "./workflowprocess";

export default interface Submission {
  _id?: string,
  id: number,
  templateId: string,
  templatePackageId: string,
  name: string,
  orgId: number,
  programId: string,
  submittedDate: string,
  workbookData: {[key: string]: any},
  workflowProcessId: string,
  workflowId: string,
  statusId: string,
  year?: string,
  submissionPeriodId: string,
  createdAt: string,
  updatedAt: string,
  updatedBy: string,
  isPublished: boolean,
  version: number,
  isLatest: boolean,
  parentId?: string,
}
export interface SubmissionPopulated {
  statusId: Status,
  workflowProcessId: WorkflowProcess,
  submissionPeriodId: SubmissionPeriod,
  programId: Program;
  _id?: string;
  templateId: string;
  templatePackageId: string;
  name: string;
  orgId: number;
  submittedDate: string;
  workbookData: any;
  templateName: string;
  approved?: string;
  workflowId: string;
  year?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: User;
  isPublished: boolean;
  version: number;
  isLatest: boolean;
  approver:string;
  parentId?: string;
  updatedDate:string;
}

export interface submissionSpreadsheetProps{
  sheetID:string
}