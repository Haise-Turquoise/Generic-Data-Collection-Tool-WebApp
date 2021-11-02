import Container from 'typedi';
import SubmissionStatusRepository from '../../repositories/SubmissionStatus'
import SubmissionStatus from '../../types/submissionstatus';

export default class SubmissionStatusService {
  private submissionStatusRepository: SubmissionStatusRepository;

  constructor() {
    this.submissionStatusRepository = Container.get(SubmissionStatusRepository);
  }
  
  async findAll() {
    return this.submissionStatusRepository.findAll()
  }

  async find(query: Partial<SubmissionStatus>) {
    return this.submissionStatusRepository.find(query)
  }
}
