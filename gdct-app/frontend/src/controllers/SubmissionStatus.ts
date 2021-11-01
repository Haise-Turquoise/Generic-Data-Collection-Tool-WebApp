import axios from 'axios';
//@ts-ignore
import { host } from '../constants/domain';
import SubmissionStatus from '../types/submissionstatus';

const SubmissionStatusController = (() => {
  const SubmissionStatusAxios = axios.create({
    baseURL: `${host}/report/submissionStatus`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('').then(res => res.data),
    fetchOpen: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('/open').then(res => res.data),
  };
})();

export default SubmissionStatusController;
