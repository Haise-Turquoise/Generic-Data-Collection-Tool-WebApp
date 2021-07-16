import axios from 'axios';

import { host } from '../constants/domain';
import AppRoleResource from '../types/approleresource';

const AppRoleResourceController = (() => {
  const AppRoleResourceAxios = axios.create({
    baseURL: `${host}/role_manager/approleresources`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<AppRoleResource[]> => AppRoleResourceAxios.get('/fetch').then(res => res.data),
    fetchAppRoleResource: async (_id: string): Promise<AppRoleResource> =>
      AppRoleResourceAxios.post('/fetchAppRoleResource', { _id }).then(res => res.data),
    create: async (AppRoleResource: AppRoleResource): Promise<AppRoleResource> =>
      AppRoleResourceAxios.post('/create', { AppRoleResource }).then(
        res => res.data.AppRoleResource,
      ),
    update: async (AppRoleResource: Partial<AppRoleResource>) => AppRoleResourceAxios.put('/update', { AppRoleResource }),
    delete: async (_id: string) => AppRoleResourceAxios.post('/delete', { _id }),
  };
})();

export default AppRoleResourceController;
