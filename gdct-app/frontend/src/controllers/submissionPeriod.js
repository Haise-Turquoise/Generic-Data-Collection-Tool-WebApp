import axios from 'axios';

import { host } from '../constants/domain';

const submissionPeriodController = (() => {
  const submissionPeriodAxios = axios.create({
    baseURL: `${host}/submission_manager/submissionPeriods`,
    withCredentials: true,
  });
  return {
    fetch: async query => submissionPeriodAxios.get('/fetch').then(res => res.data.submissionPeriods),
    create: async submissionPeriod => submissionPeriodAxios.post('/create', { submissionPeriod }).then(res => res.data.submissionPeriod),
    update: async submissionPeriod => submissionPeriodAxios.put('/update', { submissionPeriod }),
    delete: async _id => submissionPeriodAxios.post('/delete', { _id }),
  };
})();

export default submissionPeriodController;
