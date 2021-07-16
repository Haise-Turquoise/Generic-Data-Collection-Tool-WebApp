import axios from 'axios';

import { host } from '../constants/domain';
import AppResource from '../types/appresource';

const AppResourceController = (() => {
  const AppResourceAxios = axios.create({
    baseURL: `${host}/role_manager/appresources`,
    withCredentials: true,
  });
  return {
    fetchAppResource: async (_id: string): Promise<AppResource> =>
      AppResourceAxios.post('/fetchAppResource', { _id }).then(res => res.data),
    fetch: async (): Promise<AppResource[]> => AppResourceAxios.get('/fetch').then(res => res.data),
    create: async (AppResource: AppResource): Promise<AppResource> =>
      AppResourceAxios.post('/create', { AppResource }).then(res => res.data.AppResource),
    delete: async (_id: string) => AppResourceAxios.post('/delete', { _id }),
    update: async (AppResource: Partial<AppResource>) => AppResourceAxios.put('/update', { AppResource }),
  };
})();

export default AppResourceController;
