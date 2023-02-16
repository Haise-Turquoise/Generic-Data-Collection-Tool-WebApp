import { ObjectId } from "mongodb";
import { SubmissionPeriodDoc } from "../../types/submissionperiod";

export default class SubmissionPeriodEntity {
  public _id: ObjectId;
  public reportingPeriodId: ObjectId;
  public programId: ObjectId[];
  public name: string;
  public startDate: string;
  public endDate: string;
  public updatedAt: any;
  public updatedBy: string;

  constructor({ _id, reportingPeriodId, programId, name, startDate, endDate, updatedAt, updatedBy }: SubmissionPeriodDoc) {
    this._id = _id;
    this.reportingPeriodId = reportingPeriodId;
    this.programId = programId;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
