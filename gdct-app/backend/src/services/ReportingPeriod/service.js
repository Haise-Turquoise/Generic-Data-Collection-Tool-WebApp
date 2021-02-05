import Container from 'typedi';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import MasterValueRepository from '../../repositories/MasterValue';

// @Service()
export default class ReportingPeriodService {
  constructor() {
    this.reportingPeriodRepository = Container.get(ReportingPeriodRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createReportingPeriod(reportingPeriod) {
    return this.reportingPeriodRepository.create(reportingPeriod);
  }

  async deleteReportingPeriod(id) {
    // Apply business rule: 
    // if the reporting period is referenced in mastervalue table, the delete operation wiil not perform
    const name = await this.reportingPeriodRepository.findById(id);
    const masterValue = await this.masterValueRepository.findOneByReportingPeriodName(name.name);
    if (masterValue != null) throw new Error("This reporting period is referenced in master value table");

    return this.reportingPeriodRepository.delete(id);
  }

  async updateReportingPeriod(id, reportingPeriod) {
    return this.reportingPeriodRepository.update(id, reportingPeriod);
  }

  async findReportingPeriod(reportingPeriod) {
    return this.reportingPeriodRepository.find(reportingPeriod);
  }
}
