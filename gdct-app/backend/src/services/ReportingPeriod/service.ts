import Container from 'typedi';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import MasterValueRepository from '../../repositories/MasterValue';
import ReportingPeriod from '../../types/reportingperiod';

// @Service()
export default class ReportingPeriodService {
  private reportingPeriodRepository: ReportingPeriodRepository;
  private masterValueRepository: MasterValueRepository;
  constructor() {
    this.reportingPeriodRepository = Container.get(ReportingPeriodRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createReportingPeriod(reportingPeriod: ReportingPeriod) {
    return this.reportingPeriodRepository.create(reportingPeriod);
  }

  async deleteReportingPeriod(id: string) {
    // Apply business rule: 
    // if the reporting period is referenced in mastervalue table, the delete operation wiil not perform
    const name = await this.reportingPeriodRepository.findById(id);
    const masterValue = await this.masterValueRepository.findOneByReportingPeriodName(name.name);
    if (masterValue != null) throw new Error("This reporting period is referenced in master value table");

    return this.reportingPeriodRepository.delete(id);
  }

  async updateReportingPeriod(id: string, reportingPeriod: Partial<ReportingPeriod>) {
    return this.reportingPeriodRepository.update(id, reportingPeriod);
  }

  async findReportingPeriod(reportingPeriod: Partial<ReportingPeriod>) {
    return this.reportingPeriodRepository.find(reportingPeriod);
  }

  async findSpecificPeriods(ids: any){
    return this.reportingPeriodRepository.findSpecificPeriods(ids);
  }

  async findReportingPeriodById(id: string) {
    return this.reportingPeriodRepository.findById(id);
  }
}
