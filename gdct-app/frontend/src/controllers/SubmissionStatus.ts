import axios from 'axios';
//@ts-ignore
import { host } from '../constants/domain';
import SubmissionStatus from '../types/packagestatus';

const SubmissionStatusController = (() => {
  const SubmissionStatusAxios = axios.create({
    baseURL: `${host}/report`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('/submissionStatus').then(res => res.data),
    fetchStatus: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('/submissionState').then(res => res.data),
  };
})();

export default SubmissionStatusController;
