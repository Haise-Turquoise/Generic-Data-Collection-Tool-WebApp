export default class MasterValueEntity {
  constructor({
    submission,
    sheet,
    reportingPeriod,
    program,
    org,
    templateType,
    template,
    COATreeId,
    categoryId,
    attributeId,
    value,
  }) {
    this.submission = submission;
    this.sheet = sheet;
    this.reportingPeriod = reportingPeriod;
    this.program = program;
    this.org = org;
    this.templateType = templateType;
    this.template = template;
    this.COATreeId = COATreeId;
    this.categoryId = categoryId;
    this.attributeId = attributeId;
    this.value = value;
  }
}
