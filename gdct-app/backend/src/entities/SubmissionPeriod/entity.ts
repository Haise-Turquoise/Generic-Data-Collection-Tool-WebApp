import { ObjectId } from "mongodb";
import { SubmissionPeriodDoc } from "../../types/submissionperiod";

export default class SubmissionPeriodEntity {
  public _id: ObjectId;
  public reportingPeriodId: ObjectId;
  public programId: ObjectId[];
  public name: string;
  public startDate: Date;
  public endDate: Date;
  public timestamp: Date;
  public updatedBy: string;

  constructor({ _id, reportingPeriodId, programId, name, startDate, endDate, timestamp, updatedBy }: SubmissionPeriodDoc) {
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
