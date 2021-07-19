import axios from 'axios';
import Status from '../types/status'
import { host } from '../constants/domain';

const statusController = (() => {
  const statusAxios = axios.create({
    baseURL: `${host}/designer/statuses`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<Status[]> => statusAxios.get('/fetch').then(res => res.data),
    fetchStatus: async (_id: string | Partial<Status>): Promise<Status> =>
      statusAxios.post('/fetchStatus', { _id }).then(res => res.data.status),
    create: async (status: Status): Promise<Status> => statusAxios.post('/create', { status }).then(res => res.data.status),
    update: async (status: Partial<Status>) => statusAxios.put('/update', { status }),
    delete: async (_id: string) => statusAxios.post('/delete', { _id }),
    findStatusByID: async (_id: string): Promise<Status> => statusAxios.post('/findStatusByID', { _id }).then(res => res.data),
  };
})();

export default statusController;
