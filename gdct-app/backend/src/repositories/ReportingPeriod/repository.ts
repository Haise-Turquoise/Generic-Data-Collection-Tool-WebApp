import ReportingPeriodEntity from '../../entities/ReportingPeriod';
import BaseRepository from '../repository';
import ReportingPeriodModel from '../../models/ReportingPeriod';
import ReportingPeriod, { ReportingPeriodDoc } from '../../types/reportingperiod';
import { FilterQuery } from 'mongoose';

export default class ReportPeriodRepository extends BaseRepository<ReportingPeriod, ReportingPeriodDoc> {
  constructor() {
    super(ReportingPeriodModel);
  }
  async delete(id: string) {
    return ReportingPeriodModel.findByIdAndDelete(id).then(
      (reportingPeriod: ReportingPeriodDoc) => new ReportingPeriodEntity(reportingPeriod),
    );
  }

  async create(reportingPeriod: ReportingPeriod) {
    return ReportingPeriodModel.create(reportingPeriod).then(
      reportingPeriod => new ReportingPeriodEntity(reportingPeriod),
    );
  }

  async update(id: string, reportingPeriod: Partial<ReportingPeriod>) {
    return ReportingPeriodModel.findByIdAndUpdate(id, reportingPeriod).then(
      (reportingPeriod: ReportingPeriodDoc) => new ReportingPeriodEntity(reportingPeriod),
    );
  }

  async find(query: Partial<ReportingPeriod>) {
    const realQuery: FilterQuery<ReportingPeriodDoc> = {};

    let key: keyof ReportingPeriod
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return ReportingPeriodModel.find(realQuery).then((status: ReportingPeriodDoc[]) =>
      status.map(reportingPeriod => new ReportingPeriodEntity(reportingPeriod)),
    );
  }

  async findSubmissionClosed(query: FilterQuery<ReportingPeriodDoc>) {
    return ReportingPeriodModel.find(query, { name: 0, _id: 0, endDate: 0, application: 0, code: 0});
  }

  async findSubmissionOpen() {
    const query = {submissionClosed: false}
    return ReportingPeriodModel.find(query, { name: 0, _id: 0, startDate: 0, endDate: 0, application: 0, submissionClosed: 0});
  }
}