export default class TemplateTypeEntity {
  constructor({
    _id,
    name,
    description,

    templateWorkflowId,
    submissionWorkflowId,

    programIds,

    isApprovable,
    isReviewable,
    isSubmittable,
    isInputtable,
    isViewable,
    isReportable,
    isActive,
  }) {
    this._id = _id;
    this.name = name;
    this.templateWorkflowId = templateWorkflowId;
    this.submissionWorkflowId = submissionWorkflowId;
    this.description = description;
    this.programIds = programIds;
    this.isApprovable = isApprovable;
    this.isReviewable = isReviewable;
    this.isSubmittable = isSubmittable;
    this.isInputtable = isInputtable;
    this.isViewable = isViewable;
    this.isReportable = isReportable;
    this.isActive = isActive;
  }
}
