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
    fetchStatus: async (): Promise<SubmissionStatus[]> => SubmissionStatusAxios.get('/submissionStateCount').then(res => res.data),

  };
})();

export default SubmissionStatusController;
