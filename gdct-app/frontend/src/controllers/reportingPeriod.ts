import axios from 'axios';
import ReportingPeriod from '../types/reportingperiod';
import { host } from '../constants/domain';

const reportingPeriodController = (() => {
  const reportingPeriodAxios = axios.create({
    baseURL: `${host}/reportingPeriods`,
    withCredentials: true,
  });
  return {
    fetch: async (query?: Partial<ReportingPeriod>): Promise<ReportingPeriod[]> => reportingPeriodAxios.get('/fetch').then(res => res.data),
    fetchReportingPeriod: async (_id: string): Promise<ReportingPeriod> =>
      reportingPeriodAxios
        .post('/fetchReportingPeriod', { _id })
        .then(res => res.data.reportingPeriod),
    create: async (reportingPeriod: ReportingPeriod): Promise<ReportingPeriod> =>
      reportingPeriodAxios
        .post('/create', { reportingPeriod })
        .then(res => res.data.reportingPeriod),
    update: async (reportingPeriod: Partial<ReportingPeriod>) =>
      reportingPeriodAxios.put('/update', { reportingPeriod }),
    delete: async (_id: string) => reportingPeriodAxios.post('/delete', { _id }),
  };
})();

export default reportingPeriodController;
