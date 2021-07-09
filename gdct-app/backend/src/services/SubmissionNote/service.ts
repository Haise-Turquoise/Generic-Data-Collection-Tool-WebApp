import Container, { Service } from 'typedi';
import SubmissionNoteRepository from '../../repositories/SubmissionNote';
import { SubmissionNoteDoc } from '../../types/submissionnote';

// @Service()
export default class SubmissionNoteService {
  private submissionNoteRepository: SubmissionNoteRepository;

  constructor() {
    this.submissionNoteRepository = Container.get(SubmissionNoteRepository);
  }

  async findSubmissionNoteById(submissionId: string) {
    return this.submissionNoteRepository.findBySubmissionId(submissionId);
  }

  async createSubmissionNote(submissionNote: SubmissionNoteDoc) {
    return this.submissionNoteRepository.create(submissionNote);
  }
}
