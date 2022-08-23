import SubmissionPeriodEntity from '../../entities/SubmissionPeriod';
import BaseRepository from '../repository';
import SubmissionPeriodModel from '../../models/SubmissionPeriod';
import SubmissionPeriod, { SubmissionPeriodDoc } from '../../types/submissionperiod';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';
import {dateStringTranslate} from '../../utils/misc';

export default class SubmissionPeriodRepository extends BaseRepository<SubmissionPeriod, SubmissionPeriodDoc> {
  constructor() {
    super(SubmissionPeriodModel);
  }

  async delete(id: string) {
    return SubmissionPeriodModel.findByIdAndDelete(id)
    .then((submissionPeriod: SubmissionPeriodDoc|null) => {
      if (!submissionPeriod) throw new AppError(`Delete failed for AppRoleResouece with ID: ${id}`);
      return new SubmissionPeriodEntity(submissionPeriod);
      });
  }

  async create(submissionPeriod: SubmissionPeriod) {

    submissionPeriod.updatedAt =  dateStringTranslate(new Date(submissionPeriod.updatedAt));
    if(submissionPeriod.startDate){ submissionPeriod.startDate = dateStringTranslate(new Date(submissionPeriod.startDate));}
    if(submissionPeriod.endDate){ submissionPeriod.endDate =dateStringTranslate(new Date(submissionPeriod.endDate));}
    return SubmissionPeriodModel.create(submissionPeriod).then(
      submissionPeriod => new SubmissionPeriodEntity(submissionPeriod),
    );
  }

  async update(id: string, submissionPeriod: Partial<SubmissionPeriod>) {
    submissionPeriod.updatedAt =  dateStringTranslate(new Date(submissionPeriod.updatedAt!));
    return SubmissionPeriodModel.findByIdAndUpdate(id, submissionPeriod)
    .then((submissionPeriod: SubmissionPeriodDoc|null) => {
      if (!submissionPeriod) throw new AppError(`Update failed for AppRoleResouece with ID: ${id}`);
      return new SubmissionPeriodEntity(submissionPeriod);
    });
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
