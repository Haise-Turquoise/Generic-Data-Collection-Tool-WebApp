import axios from 'axios';

import { host } from '../constants/domain';
import AppRole from '../types/approle';

const AppRoleController = (() => {
  const AppRoleAxios = axios.create({
    baseURL: `${host}/role_manager/approles`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<AppRole[]> => AppRoleAxios.get('/fetch').then(res => res.data),
    fetchAppRole: async (_id: string): Promise<AppRole> => AppRoleAxios.post('/fetchAppRole', { _id }).then(res => res.data),
    create: async (AppRole: AppRole): Promise<AppRole> =>
      AppRoleAxios.post('/create', { AppRole }).then(res => res.data.AppRole),
    delete: async (_id: string) => AppRoleAxios.post('/delete', { _id }),
    update: async (AppRole: AppRole) => AppRoleAxios.put('/update', { AppRole }),
  };
})();

export default AppRoleController;
