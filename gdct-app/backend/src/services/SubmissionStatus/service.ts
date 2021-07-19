import Container from 'typedi';
import SubmissionStatusRepository from '../../repositories/SubmissionStatus'

export default class SubmissionStatusService {
  private submissionStatusRepository: SubmissionStatusRepository;

  constructor() {
    this.submissionStatusRepository = Container.get(SubmissionStatusRepository);
  }
  
  async findAll() {
    return this.submissionStatusRepository.findAll()
  }
}
