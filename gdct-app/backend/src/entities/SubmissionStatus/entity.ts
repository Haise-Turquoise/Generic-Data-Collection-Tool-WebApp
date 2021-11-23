import { ObjectId } from "mongodb";
import SubmissionStatus from "../../repositories/SubmissionStatus";
import SubmissionStatusType from "../../types/submissionstatus";

// It's possible that we can extend an object for all entity classes
export default class SubmissionStatusEntity {
  public _id: ObjectId | undefined;
  public name: string;
  public org: {id: number, name: string};
  public template: {name: string};
  public submission?: {_id: ObjectId, name: string};
  public subIndex: number | null;
  public program: {code: string, name: string};
  public status: {name: string};
  public submissionPeriod: {name: string};
  public templateType: {name: string};
  public submissionNote: {submissionId: ObjectId, updatedDate: Date | '', updatedBy?: string};
  public reportingPeriod: {submissionClosed: boolean};

  constructor({
    _id,
    name,
    org,
    template,
    submission,
    subIndex,
    program,
    status,
    submissionPeriod,
    templateType,
    submissionNote,
    reportingPeriod,
  }: SubmissionStatusType) {
    this._id = _id;
    this.name = name;
    this.org = org;
    this.template = template;
    this.submission = submission;
    this.subIndex = subIndex;
    this.program = program;
    this.status = status;
    this.submissionPeriod = submissionPeriod;
    this.templateType = templateType;
    this.submissionNote = submissionNote;
    this.reportingPeriod = reportingPeriod;
  }
}
