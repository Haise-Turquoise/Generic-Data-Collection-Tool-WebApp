import ReportingPeriodEntity from '../../entities/ReportingPeriod';
import BaseRepository from '../repository';
import ReportingPeriodModel from '../../models/ReportingPeriod';
import ReportingPeriod, { ReportingPeriodDoc } from '../../types/reportingperiod';
import {dateStringTranslate} from '../../utils/misc';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';

export default class ReportPeriodRepository extends BaseRepository<ReportingPeriod, ReportingPeriodDoc> {
  constructor() {
    super(ReportingPeriodModel);
  }
  async delete(id: string) {
    return ReportingPeriodModel.findByIdAndDelete(id)
    .then((reportingPeriod: ReportingPeriodDoc|null) =>{
      if (!reportingPeriod) throw new AppError(`Delete failed, Item not found for ReportingPeriod item with ID: ${id}`);
      return new ReportingPeriodEntity(reportingPeriod);
    });
  }

  async create(reportingPeriod: ReportingPeriod) {
    reportingPeriod.updatedAt = dateStringTranslate(new Date(reportingPeriod.updatedAt))
    if(reportingPeriod.startDate) {reportingPeriod.startDate = dateStringTranslate(new Date(reportingPeriod.startDate))}
    if(reportingPeriod.endDate){reportingPeriod.endDate = dateStringTranslate(new Date(reportingPeriod.endDate))}
    
    return ReportingPeriodModel.create(reportingPeriod).then(
      reportingPeriod => new ReportingPeriodEntity(reportingPeriod),
    );
  }

  async update(id: string, reportingPeriod: Partial<ReportingPeriod>) {
    reportingPeriod.updatedAt = dateStringTranslate(new Date(reportingPeriod.updatedAt!))
    if(reportingPeriod.startDate) {reportingPeriod.startDate = dateStringTranslate(new Date(reportingPeriod.startDate))}
    if(reportingPeriod.endDate){reportingPeriod.endDate = dateStringTranslate(new Date(reportingPeriod.endDate))}
    return ReportingPeriodModel.findByIdAndUpdate(id, reportingPeriod)
    .then((reportingPeriod: ReportingPeriodDoc|null) => {
      if (!reportingPeriod) throw new AppError(`Update failed, Item not found for ReportingPeriod item with ID: ${id}`);
      return new ReportingPeriodEntity(reportingPeriod)
    });
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

  async findSpecificPeriods(ids: any){

    return ReportingPeriodModel.find({code: {$in : ids} });

  }
  async findSubmissionClosed(query: FilterQuery<ReportingPeriodDoc>) {
    return ReportingPeriodModel.find(query, { name: 0, _id: 0, endDate: 0, application: 0, code: 0});
  }

  async findSubmissionOpen() {
    const query = {submissionClosed: false}
    return ReportingPeriodModel.find(query, { name: 0, _id: 0, startDate: 0, endDate: 0, application: 0, submissionClosed: 0});
  }
}