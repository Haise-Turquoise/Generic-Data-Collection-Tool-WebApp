import axios from 'axios';
import SheetName from '../types/sheetname'
import { host } from '../constants/domain';

const sheetNameController = (() => {
  const sheetNameAxios = axios.create({
    baseURL: `${host}/sheetNames`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<SheetName[]> => sheetNameAxios.get('/fetch').then(res => res.data),
    fetchById: async (_id: string): Promise<SheetName> => sheetNameAxios.post('/fetchById', { _id }).then(res => res.data),
    create: async (sheetName: SheetName): Promise<SheetName> =>
      sheetNameAxios.post('/create', { sheetName }).then(res => res.data.sheetName),
    update: async (sheetName: Partial<SheetName>) => sheetNameAxios.put('/update', { sheetName }),
    delete: async (_id: string) => sheetNameAxios.post('/delete', { _id }),
  };
})();

export default sheetNameController;
