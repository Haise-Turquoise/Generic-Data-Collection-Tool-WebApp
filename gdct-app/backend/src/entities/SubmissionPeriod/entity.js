export default class SubmissionPeriodEntity {
  constructor({ _id, reportingPeriodId, programId, name, startDate, endDate, timestamp, updatedBy }) {
    this._id = _id;
    this.reportingPeriodId = reportingPeriodId;
    this.programId = programId;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
