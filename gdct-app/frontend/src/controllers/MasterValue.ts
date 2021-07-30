import axios from 'axios';

import { host } from '../constants/domain';
import { MasterValue } from '../types/mastervalue';

const masterValueController = (() => {
  const masterValueAxios = axios.create({
    baseURL: `${host}/masterValue`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<MasterValue[]> => masterValueAxios.get('/fetch').then(res => res.data.masterValue),
    create: async (masterValue: MasterValue): Promise<MasterValue | null> =>
      masterValueAxios.post('/create', { masterValue }).then(res => res.data.masterValue),
    update: async (masterValue: MasterValue) => masterValueAxios.put('/update', { masterValue }),
    delete: async (_id: string) => masterValueAxios.post('/delete', { _id }),
    addDocument: async (masterValue: Partial<MasterValue>): Promise<MasterValue> =>
      masterValueAxios.post('/addDocument', { masterValue }).then(res => res.data.masterValue),
  };
})();

export default masterValueController;
