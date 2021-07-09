import Container from 'typedi';
import SubmissionPeriodRepository from '../../repositories/SubmissionPeriod';
import { SubmissionPeriodDoc } from '../../types/submissionperiod';

// @Service()
export default class SubmissionPeriodService {
  private submissionPeriodRepository: SubmissionPeriodRepository;

  constructor() {
    this.submissionPeriodRepository = Container.get(SubmissionPeriodRepository);
  }

  async createSubmissionPeriod(submissionPeriod: SubmissionPeriodDoc) {
    return this.submissionPeriodRepository.create(submissionPeriod);
  }

  async deleteSubmissionPeriod(id: string) {
    return this.submissionPeriodRepository.delete(id);
  }

  async updateSubmissionPeriod(id: string, submissionPeriod: SubmissionPeriodDoc) {
    return this.submissionPeriodRepository.update(id, submissionPeriod);
  }

  async findSubmissionPeriod(submissionPeriod: SubmissionPeriodDoc) {
    return this.submissionPeriodRepository.find(submissionPeriod.toObject());
  }

   async findSubmissionPeriodById(id: string) {
    return this.submissionPeriodRepository.findById(id);
  }
}
