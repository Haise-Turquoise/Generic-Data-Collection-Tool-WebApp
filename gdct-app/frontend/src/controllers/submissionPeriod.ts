import axios from 'axios';
import SubmissionPeriod from '../types/submissionperiod';
import { host } from '../constants/domain';

const submissionPeriodController = (() => {
  const submissionPeriodAxios = axios.create({
    baseURL: `${host}/submission_manager/submissionPeriods`,
    withCredentials: true,
  });
  return {
    fetch: async (query: Partial<SubmissionPeriod>): Promise<SubmissionPeriod[]> =>
      submissionPeriodAxios.get('/fetch').then(res => res.data.submissionPeriods),
    create: async (submissionPeriod: SubmissionPeriod): Promise<SubmissionPeriod | null> =>
      submissionPeriodAxios
        .post('/create', { submissionPeriod })
        .then(res => res.data.submissionPeriod),
    update: async (submissionPeriod: Partial<SubmissionPeriod>) => submissionPeriodAxios.put('/update', { submissionPeriod }),
    delete: async (_id: string) => submissionPeriodAxios.post('/delete', { _id }),
  };
})();

export default submissionPeriodController;
