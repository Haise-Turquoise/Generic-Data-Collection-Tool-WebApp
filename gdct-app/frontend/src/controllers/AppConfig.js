import axios from 'axios';

import { host } from '../constants/domain';

const AppConfigController = (() => {
  const AppConfigAxios = axios.create({
    baseURL: `${host}/role_manager/appConfigs`,
    withCredentials: true,
  });

  return {
    fetchAppConfig: async _id => AppConfigAxios.get(`/${_id}`).then(res => res.data.AppConfig),
    fetch: async () => AppConfigAxios.get('/searchAllAppConfigs').then(res => res.data.AppConfigs),
    create: async AppConfig => AppConfigAxios.post('', { AppConfig }).then(res => res.data.AppConfig),
    delete: async _id => AppConfigAxios.delete(`/${_id}`),
    update: async AppConfig => AppConfigAxios.put(`/${AppConfig._id}`, { AppConfig }),
  };
})();

export default AppConfigController;
