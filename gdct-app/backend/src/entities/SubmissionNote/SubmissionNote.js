export default class SubmissionEntity {
  constructor({ _id, id, note, submissionId, updatedDate, updatedBy, role }) {
    this._id = _id;
    this.id = id;
    this.note = note;
    this.submissionId = submissionId;
    this.updatedDate = updatedDate;
    this.updatedBy = updatedBy;
    this.role = role;
  }
}
