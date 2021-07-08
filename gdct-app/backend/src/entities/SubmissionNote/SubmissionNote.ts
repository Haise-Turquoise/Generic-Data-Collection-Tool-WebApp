import { ObjectId } from "mongodb";
import { SubmissionNoteDoc } from "../../types/submissionnote";

export default class SubmissionEntity {
  public _id: ObjectId;
  public id: number;
  public note: string;
  public submissionId: ObjectId;
  public updatedDate: Date;
  public updatedBy: string;
  public role: string;

  constructor({ _id, id, note, submissionId, updatedDate, updatedBy, role }: SubmissionNoteDoc) {
    this._id = _id;
    this.id = id;
    this.note = note;
    this.submissionId = submissionId;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.role = role;
  }
}
