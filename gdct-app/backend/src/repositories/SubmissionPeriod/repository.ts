import SubmissionPeriodEntity from '../../entities/SubmissionPeriod';
import BaseRepository from '../repository';
import SubmissionPeriodModel from '../../models/SubmissionPeriod';
import { SubmissionPeriodDoc } from '../../types/submissionperiod';
import { FilterQuery } from 'mongoose';

export default class SubmissionPeriodRepository extends BaseRepository<SubmissionPeriodDoc> {
  constructor() {
    super(SubmissionPeriodModel);
  }

  async delete(id: string) {
    return SubmissionPeriodModel.findByIdAndDelete(id).then(
      (submissionPeriod: SubmissionPeriodDoc) => new SubmissionPeriodEntity(submissionPeriod),
    );
  }

  async create(submissionPeriod: SubmissionPeriodDoc) {
    return SubmissionPeriodModel.create(submissionPeriod).then(
      submissionPeriod => new SubmissionPeriodEntity(submissionPeriod),
    );
  }

  async update(id: string, submissionPeriod: SubmissionPeriodDoc) {
    return SubmissionPeriodModel.findByIdAndUpdate(id, submissionPeriod).then(
      (submissionPeriod: SubmissionPeriodDoc) => new SubmissionPeriodEntity(submissionPeriod),
    );
  }

  async findByIds(ids: string[]){
    const data = await SubmissionPeriodModel.find({ _id: { $in: ids } });
    return data.map((submitPeriod: SubmissionPeriodDoc)=>
      new SubmissionPeriodEntity(submitPeriod)
    );
  }

  async find(query: FilterQuery<SubmissionPeriodDoc>) {
    const realQuery: FilterQuery<SubmissionPeriodDoc> = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return SubmissionPeriodModel.find(realQuery).then((submissionPeriods: SubmissionPeriodDoc[]) =>
      submissionPeriods.map(
        submissionPeriod => new SubmissionPeriodEntity(submissionPeriod),
      ),
    );
  }
}
