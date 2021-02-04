export default class ReportingPeriodEntity {
  constructor({ _id, name, startDate, endDate, code, submissionClosed }) {
    this._id = _id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.code = code;
    this.submissionClosed = submissionClosed;
  }
}
