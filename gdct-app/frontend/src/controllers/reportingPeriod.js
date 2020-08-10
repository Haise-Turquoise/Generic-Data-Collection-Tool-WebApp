import axios from 'axios';

import { host } from '../constants/domain';

const reportingPeriodController = (() => {
  const reportingPeriodAxios = axios.create({
    baseURL: `${host}/reportingPeriods`,
    withCredentials: true,
  });
  return {
    fetch: async query => reportingPeriodAxios.get('').then(res => res.data.reportingPeriods),
    create: async reportingPeriod =>
      reportingPeriodAxios.post('', { reportingPeriod }).then(res => res.data.reportingPeriod),
    delete: async _id => reportingPeriodAxios.delete(`/${_id}`),
    update: async reportingPeriod =>
      reportingPeriodAxios.put(`/${reportingPeriod._id}`, { reportingPeriod }),
  };
})();

export default reportingPeriodController;
