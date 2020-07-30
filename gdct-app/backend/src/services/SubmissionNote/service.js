import Container, { Service } from 'typedi';
import SubmissionNoteRepository from '../../repositories/SubmissionNote';

// @Service()
export default class SubmissionNoteService {
  constructor() {
    this.submissionNoteRepository = Container.get(SubmissionNoteRepository);
  }

  async findSubmissionNoteById(submissionId) {
    return this.submissionNoteRepository.findBySubmissionId(submissionId);
  }

  async createSubmissionNote(submissionNote) {
    return this.submissionNoteRepository.create(submissionNote);
  }
}
