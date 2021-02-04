import ReportingPeriodEntity from '../../entities/ReportingPeriod';
import BaseRepository from '../repository';
import ReportingPeriodModel from '../../models/ReportingPeriod';

export default class ReportPeriodRepository extends BaseRepository {
  constructor() {
    super(ReportingPeriodModel);
  }
  async delete(id) {
    return ReportingPeriodModel.findByIdAndDelete(id).then(
      reportingPeriod => new ReportingPeriodEntity(reportingPeriod.toObject()),
    );
  }

  async create(reportingPeriod) {
    return ReportingPeriodModel.create(reportingPeriod).then(
      reportingPeriod => new ReportingPeriodEntity(reportingPeriod.toObject()),
    );
  }

  async update(id, reportingPeriod) {
    return ReportingPeriodModel.findByIdAndUpdate(id, reportingPeriod).then(
      reportingPeriod => new ReportingPeriodEntity(reportingPeriod.toObject()),
    );
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return ReportingPeriodModel.find(realQuery).then(status =>
      status.map(reportingPeriod => new ReportingPeriodEntity(reportingPeriod.toObject())),
    );
  }

  async findSubmissionClosed(query) {
    return ReportingPeriodModel.find(query, { name: 0, _id: 0, endDate: 0, application: 0, code: 0});
  }

  async findSubmissionOpen() {
    const query = {submissionClosed: false}
    return ReportingPeriodModel.find(query, { name: 0, _id: 0, startDate: 0, endDate: 0, application: 0, submissionClosed: 0});
  }
}