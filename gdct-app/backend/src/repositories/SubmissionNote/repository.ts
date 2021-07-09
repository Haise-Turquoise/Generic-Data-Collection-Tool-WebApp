import SubmissionNoteEntity from '../../entities/SubmissionNote/SubmissionNote';
import BaseRepository from '../repository';
import SubmissionNoteModel from '../../models/SubmissionNote';
import { SubmissionNoteDoc } from '../../types/submissionnote';

export default class SubmissionNoteRepository extends BaseRepository<SubmissionNoteDoc> {
  constructor() {
    super(SubmissionNoteModel);
  }

  async create(submissionNote: SubmissionNoteDoc) {
    console.log(submissionNote);
    return SubmissionNoteModel.create(submissionNote);
  }

  async findBySubmissionId(submissionId: string) {
    return SubmissionNoteModel.find({ submissionId });
  }
}
