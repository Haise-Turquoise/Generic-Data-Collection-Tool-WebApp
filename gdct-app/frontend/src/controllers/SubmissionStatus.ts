import axios from 'axios';
//@ts-ignore
import { host } from '../constants/domain';
import SubmissionStatus from '../types/submissionstatus';

interface role {
  role: string,
  orgId: string,
  progId: string,
  tempTypeId: string,
}

const SubmissionStatusController = (() => {
  const SubmissionStatusAxios = axios.create({
    baseURL: `${host}/report/submissionStatus`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('').then(res => res.data),
    fetchOpen: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('/open').then(res => res.data),
    createByRoles: async (roles: role[], userId: string): Promise<boolean> => SubmissionStatusAxios.post('/createByRoles', { roles, userId }).then(res => res.data),
<<<<<<< HEAD
    fetchStatus: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('/submissionState').then(res => res.data),
=======
>>>>>>> parent of e784f7ed (Revert "Merged PR 324: refresh")
  };
})();

export default SubmissionStatusController;
