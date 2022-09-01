import SubmissionNoteEntity from '../../entities/SubmissionNote/SubmissionNote';
import BaseRepository from '../repository';
import SubmissionNoteModel from '../../models/SubmissionNote';
import SubmissionNote, { SubmissionNoteDoc } from '../../types/submissionnote';
import {dateStringTranslate} from '../../utils/misc';

export default class SubmissionNoteRepository extends BaseRepository<SubmissionNote, SubmissionNoteDoc> {
  constructor() {
    super(SubmissionNoteModel);
  }

  async create(submissionNote: SubmissionNote) {
    submissionNote.updatedDate = dateStringTranslate(new Date(submissionNote.updatedDate));
    return SubmissionNoteModel.create(submissionNote);
  }

  async findBySubmissionId(submissionId: string) {
    return SubmissionNoteModel.find({ submissionId });
  }

  async updateNoteToNewSubmission(oldSubmissionId: string, newSubmissionId: string){
    return SubmissionNoteModel.updateMany({submissionId:oldSubmissionId}, {$set:{submissionId:newSubmissionId}});
  }
}
