import axios from 'axios';
import AppSysRole from '../types/appsysrole';
import { host } from '../constants/domain';

const AppSysRoleController = (() => {
  const AppSysRoleAxios = axios.create({
    baseURL: `${host}/role_manager/AppSysRoles`,
    withCredentials: true,
  });

  return {
    fetch: async (): Promise<AppSysRole[]> => AppSysRoleAxios.get('/fetch').then(res => res.data),
    fetchAppSysRole: async (_id: string): Promise<AppSysRole | null> =>
      AppSysRoleAxios.post('/fetchAppSysRole', { _id }).then(res => res.data),
    create: async (AppSysRole: AppSysRole): Promise<AppSysRole | null> =>
      AppSysRoleAxios.post('/create', { AppSysRole }).then(res => res.data.AppSysRole),
    update: async (AppSysRole: Partial<AppSysRole>) => AppSysRoleAxios.put('/update', { AppSysRole }),
    delete: async (_id: string) => AppSysRoleAxios.post('/delete', { _id }),
  };
})();

export default AppSysRoleController;
