import { ObjectId } from "mongodb";
import { ReportingPeriodDoc } from "../../types/reportingperiod";

export default class ReportingPeriodEntity {
  public _id: ObjectId;
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public code: string;
  public submissionClosed: boolean;
  public updatedAt: any;
  public updatedBy: string;

  constructor({ _id, name, startDate, endDate, code, submissionClosed, updatedAt, updatedBy }: ReportingPeriodDoc) {
    this._id = _id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.code = code;
    this.submissionClosed = submissionClosed;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
