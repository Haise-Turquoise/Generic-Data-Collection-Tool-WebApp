import axios from 'axios';
import CategoryGroup from '../types/categorygroup';
import { host } from '../constants/domain';

const COAGroupController = (() => {
  const COAGroupAxios = axios.create({
    baseURL: `${host}/COA_manager/COAGroups`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<CategoryGroup[]> => COAGroupAxios.get('/fetch').then(res => res.data),
    fetchCOAGroup: async (_id: string): Promise<CategoryGroup | null> => COAGroupAxios.post('/fetchCOAGroup', { _id }).then(res => res.data),
    create: async (COAGroup: CategoryGroup | CategoryGroup[]): Promise<CategoryGroup | CategoryGroup[] | null> =>
      COAGroupAxios.post('/create', { COAGroup }).then(res => res.data.COAGroup),
    update: async (COAGroup: Promise<CategoryGroup>) => COAGroupAxios.put('update', { COAGroup }),
    delete: async (_id: string) => COAGroupAxios.post('/delete', { _id }),
  };
})();

export default COAGroupController;
