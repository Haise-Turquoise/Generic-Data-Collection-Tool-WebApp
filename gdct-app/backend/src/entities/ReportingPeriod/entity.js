export default class ReportingPeriodEntity {
  constructor({ _id, name, startDate, endDate, code, submissionClosed, timestamp, updatedBy }) {
    this._id = _id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.code = code;
    this.submissionClosed = submissionClosed;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
