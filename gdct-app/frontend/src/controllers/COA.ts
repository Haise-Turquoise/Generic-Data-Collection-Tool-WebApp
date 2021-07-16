import axios from 'axios';
import Category from '../types/category';
import { host } from '../constants/domain';

const COAController = (() => {
  const COAAxios = axios.create({
    baseURL: `${host}/COA_manager/COAs`,
    withCredentials: true,
  });

  return {
    fetch: async (): Promise<Category[]> => COAAxios.get('/fetch').then(res => res.data),
    fetchCOAbyId: async (_id: string): Promise<any> => COAAxios.post('/fetchCOAById', { _id }).then(res => res.data),
    create: async (COA: Category | Category[]): Promise<Category | Category[]> => COAAxios.post('/create', { COA }).then(res => res.data.COA),
    update: async (COA: Partial<Category>) => COAAxios.put('/update', { COA }),
    delete: async (_id: string) => COAAxios.post('/delete', { _id }),
  };
})();

export default COAController;
