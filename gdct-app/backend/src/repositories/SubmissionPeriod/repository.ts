import SubmissionPeriodEntity from '../../entities/SubmissionPeriod';
import BaseRepository from '../repository';
import SubmissionPeriodModel from '../../models/SubmissionPeriod';
import SubmissionPeriod, { SubmissionPeriodDoc } from '../../types/submissionperiod';
import { FilterQuery } from 'mongoose';

export default class SubmissionPeriodRepository extends BaseRepository<SubmissionPeriod, SubmissionPeriodDoc> {
  constructor() {
    super(SubmissionPeriodModel);
  }

  async delete(id: string) {
    return SubmissionPeriodModel.findByIdAndDelete(id).then(
      (submissionPeriod: SubmissionPeriodDoc) => new SubmissionPeriodEntity(submissionPeriod),
    );
  }

  async create(submissionPeriod: SubmissionPeriod) {
    return SubmissionPeriodModel.create(submissionPeriod).then(
      submissionPeriod => new SubmissionPeriodEntity(submissionPeriod),
    );
  }

  async update(id: string, submissionPeriod: Partial<SubmissionPeriod>) {
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

  async find(query: Partial<SubmissionPeriod>) {
    const realQuery: FilterQuery<SubmissionPeriodDoc> = {};
    let key: keyof SubmissionPeriod
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return SubmissionPeriodModel.find(realQuery).then((submissionPeriods: SubmissionPeriodDoc[]) =>
      submissionPeriods.map(
        submissionPeriod => new SubmissionPeriodEntity(submissionPeriod),
      ),
    );
  }
}
