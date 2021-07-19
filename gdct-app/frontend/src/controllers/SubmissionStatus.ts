import axios from 'axios';
//@ts-ignore
import { host } from '../constants/domain';

const SubmissionStatusController = (() => {
  const SubmissionStatusAxios = axios.create({
    baseURL: `${host}/report/submissionStatus`,
    withCredentials: true,
  });
  return {
    fetch: async () => SubmissionStatusAxios.get('').then(res => res.data),
  };
})();

export default SubmissionStatusController;
