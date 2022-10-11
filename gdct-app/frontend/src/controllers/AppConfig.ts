import axios from 'axios';
import AppConfig from '../types/appconfig';
import { host } from '../constants/domain';

const AppConfigController = (() => {
  const AppConfigAxios = axios.create({
    baseURL: `${host}/role_manager/appConfigs`,
    withCredentials: true,
  });

  return {
    fetchAppConfig: async (_id: string): Promise<AppConfig | null> =>
      AppConfigAxios.post('/fetchAppConfig', { _id }).then(res => res.data.AppConfig),
    fetchSessionCheckingPeriod: async (): Promise<AppConfig | null> =>
      AppConfigAxios.post('/fetchSessionCheckingPeriod').then(res => res.data),
    fetchValidationThreshold: async (): Promise<AppConfig | null> =>
      AppConfigAxios.get('/validationThreshold').then(res => res.data),
    fetchAttributeRow: async (): Promise<AppConfig | null> => AppConfigAxios.get('/attributeRow').then(res => res.data),
    fetch: async (): Promise<AppConfig[]> => AppConfigAxios.get('/searchAllAppConfigs').then(res => res.data),
    create: async (AppConfig: AppConfig): Promise<AppConfig | null> =>
      AppConfigAxios.post('/create', { AppConfig }).then(res => res.data.AppConfig),
    delete: async (_id: string) => AppConfigAxios.post('/delete', { _id }),
    update: async (AppConfig: Partial<AppConfig>) => AppConfigAxios.put('/update', { _id: AppConfig._id, AppConfig }),
  };
})();

export default AppConfigController;
