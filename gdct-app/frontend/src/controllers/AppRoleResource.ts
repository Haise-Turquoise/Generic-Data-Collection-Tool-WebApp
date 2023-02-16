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
    fetchAppRoleResource: async (_id: string): Promise<AppRoleResource | null> =>
      AppRoleResourceAxios.post('/fetchAppRoleResource', { _id }).then(res => res.data),
    create: async (AppRoleResource: AppRoleResource): Promise<AppRoleResource | null> =>
      AppRoleResourceAxios.post('/create', { AppRoleResource }).then(
        res => res.data.AppRoleResource,
      ),
    update: async (AppRoleResource: Partial<AppRoleResource>) => AppRoleResourceAxios.put('/update', {AppRoleResource }),
    delete: async (_id: string) => AppRoleResourceAxios.post('/delete', { _id }),

    // fetchAppRoleResource: async (_id: string): Promise<AppRoleResource | null> =>
    // AppRoleResourceAxios.post('/fetchAppRoleResource', { _id }).then(res => res.data.AppRoleResource),
    // fetchSessionCheckingPeriod: async (): Promise<AppRoleResource | null> =>
    // AppRoleResourceAxios.post('/fetchSessionCheckingPeriod').then(res => res.data),
    // fetchValidationThreshold: async (): Promise<AppRoleResource | null> =>
    // AppRoleResourceAxios.get('/validationThreshold').then(res => res.data),
    // fetchAttributeRow: async (): Promise<AppRoleResource | null> => AppRoleResourceAxios.get('/attributeRow').then(res => res.data),
    // fetch: async (): Promise<AppRoleResource[]> => AppRoleResourceAxios.get('/fetch').then(res => res.data),
    // create: async (AppRoleResource: AppRoleResource): Promise<AppRoleResource | null> =>
    // AppRoleResourceAxios.post('/create', { AppRoleResource }).then(res => res.data.AppRoleResource),
    // delete: async (_id: string) => AppRoleResourceAxios.post('/delete', { _id }),
    // update: async (AppRoleResource: Partial<AppRoleResource>) => AppRoleResourceAxios.put('/update', {AppRoleResource }),
  };
})();

export default AppRoleResourceController;
