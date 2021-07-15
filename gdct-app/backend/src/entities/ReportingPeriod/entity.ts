import { ObjectId } from "mongodb";
import { ReportingPeriodDoc } from "../../types/reportingperiod";

export default class ReportingPeriodEntity {
  public _id: ObjectId;
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public code: string;
  public submissionClosed: boolean;
  public timestamp: Date;
  public updatedBy: string;

  constructor({ _id, name, startDate, endDate, code, submissionClosed, timestamp, updatedBy }: ReportingPeriodDoc) {
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
