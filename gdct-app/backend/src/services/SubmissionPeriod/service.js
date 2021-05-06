import Container from 'typedi';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';

// @Service()
export default class SubmissionPeriodService {
  constructor() {
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
  }

  async createSubmissionPeriod(submissionPeriod) {
    return this.submissionPeriodRepository.create(submissionPeriod);
  }

  async deleteSubmissionPeriod(id) {
    return this.submissionPeriodRepository.delete(id);
  }

  async updateSubmissionPeriod(id, submissionPeriod) {
    return this.submissionPeriodRepository.update(id, submissionPeriod);
  }

  async findSubmissionPeriod(submissionPeriod) {
    return this.submissionPeriodRepository.find(submissionPeriod);
  }

   async findSubmissionPeriodById(id) {
    return this.submissionPeriodRepository.findById(id);
  }
}
