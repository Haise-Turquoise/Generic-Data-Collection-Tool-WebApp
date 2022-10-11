import Container from 'typedi';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';
import SubmissionPeriod from '../../types/submissionperiod';

// @Service()
export default class SubmissionPeriodService {
  private submissionPeriodRepository: SubmissionPeriodRepository;

  constructor() {
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
  }

  async createSubmissionPeriod(submissionPeriod: SubmissionPeriod) {
    return this.submissionPeriodRepository.create(submissionPeriod);
  }

  async deleteSubmissionPeriod(id: string) {
    return this.submissionPeriodRepository.delete(id);
  }

  async updateSubmissionPeriod(id: string, submissionPeriod: Partial<SubmissionPeriod>) {
    return this.submissionPeriodRepository.update(id, submissionPeriod);
  }

  async findSubmissionPeriod(submissionPeriod: Partial<SubmissionPeriod>) {
    return this.submissionPeriodRepository.find(submissionPeriod);
  }

   async findSubmissionPeriodById(id: string) {
    return this.submissionPeriodRepository.findById(id);
  }
}
