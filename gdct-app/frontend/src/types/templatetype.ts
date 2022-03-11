export default interface TemplateType {
  _id: string,
  description: string,
  programId: string[],
  isApprovable: boolean,
  isSubmittable: boolean,
  isReviewable: boolean,
  isInputtable: boolean,
  isViweable: boolean,
  isReportable: boolean,
  isActive: boolean,
  // issue in DB?
  isViewable?: boolean | null,
  updatedAt: string,
  updatedBy: string,
  name: string,
  submissionWorkflowId?: string,
  templateWorkflowId?: string,
}