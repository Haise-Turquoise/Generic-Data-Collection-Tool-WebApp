import axios from 'axios';

import { host } from '../constants/domain';

const submissionPeriodController = (() => {
  const submissionPeriodAxios = axios.create({
    baseURL: `${host}/submission_manager/submissionPeriods`,
    withCredentials: true,
  });
  return {
    fetch: async query => submissionPeriodAxios.get('').then(res => res.data.submissionPeriods),
    create: async submissionPeriod =>
      submissionPeriodAxios.post('', { submissionPeriod }).then(res => res.data.submissionPeriod),
    delete: async _id => submissionPeriodAxios.delete(`/${_id}`),
    update: async submissionPeriod =>
      submissionPeriodAxios.put(`/${submissionPeriod._id}`, {
        submissionPeriod,
      }),
  };
})();

export default submissionPeriodController;
