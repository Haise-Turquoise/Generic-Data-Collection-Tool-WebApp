import axios from 'axios';

import { host } from '../constants/domain';

const AppConfigController = (() => {
  const AppConfigAxios = axios.create({
    baseURL: `${host}/role_manager/appConfigs`,
    withCredentials: true,
  });

  return {
    fetchAppConfig: async _id => AppConfigAxios.post('/fetchAppConfig', { _id }).then(res => res.data.AppConfig),
    fetchSessionCheckingPeriod : async _ => AppConfigAxios.post('/fetchSessionCheckingPeriod').then(res => res.data),
    fetch: async () => AppConfigAxios.get('/searchAllAppConfigs').then(res => res.data),
    create: async AppConfig => AppConfigAxios.post('/create', { AppConfig }).then(res => res.data.AppConfig),
    delete: async _id => AppConfigAxios.post('/delete', { _id }),
    update: async AppConfig => AppConfigAxios.put('/update', { _id: AppConfig._id, AppConfig: AppConfig}),
  };
})();

export default AppConfigController;
