import axios from 'axios';
//@ts-ignore
import { host } from '../constants/domain';

const SubmissionStatusController = (() => {
  const MenuAxios = axios.create({
    baseURL: `${host}/report/submissionStatus`,
    withCredentials: true,
  });
  return {
    fetch: async () => MenuAxios.get('').then(res => res.data),
  };
})();

export default SubmissionStatusController;
