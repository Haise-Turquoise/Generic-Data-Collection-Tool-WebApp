export default class TemplateTypeEntity {
  constructor({
    _id,
    name,
    description,

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
