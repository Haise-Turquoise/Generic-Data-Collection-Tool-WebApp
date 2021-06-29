import axios from 'axios';

import { host } from '../constants/domain';

const reportingPeriodController = (() => {
  const reportingPeriodAxios = axios.create({
    baseURL: `${host}/reportingPeriods`,
    withCredentials: true,
  });
  return {
    fetch: async query => reportingPeriodAxios.get('/fetch').then(res => res.data),
    fetchReportingPeriod: async _id =>
      reportingPeriodAxios
        .post('/fetchReportingPeriod', { _id })
        .then(res => res.data.reportingPeriod),
    create: async reportingPeriod =>
      reportingPeriodAxios
        .post('/create', { reportingPeriod })
        .then(res => res.data.reportingPeriod),
    update: async reportingPeriod => reportingPeriodAxios.put('/update', { reportingPeriod }),
    delete: async _id => reportingPeriodAxios.post('/delete', { _id }),
  };
})();

export default reportingPeriodController;
