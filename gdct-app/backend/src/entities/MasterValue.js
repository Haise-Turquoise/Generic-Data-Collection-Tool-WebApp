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
    CategoryId,
    AttributeId,
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
    this.CategoryId = CategoryId;
    this.AttributeId = AttributeId;
    this.value = value;
  }
}
