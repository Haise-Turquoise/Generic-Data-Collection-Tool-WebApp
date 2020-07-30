import SubmissionNoteEntity from '../../entities/SubmissionNote/SubmissionNote';
import BaseRepository from '../repository';
import SubmissionNoteModel from '../../models/SubmissionNote';

export default class SubmissionNoteRepository extends BaseRepository {
  constructor() {
    super(SubmissionNoteModel);
  }

  async create(submissionNote) {
    return SubmissionNoteModel.create(submissionNote);
  }

  async findBySubmissionId(submissionId) {
    return SubmissionNoteModel.find({ submissionId });
  }
}
