import axios from 'axios';

import { host } from '../constants/domain';

const AppSysController = (() => {
  const AppSysAxios = axios.create({
    baseURL: `${host}/role_manager/appSyses`,
    withCredentials: true,
  });

  return {
    fetch: async () => AppSysAxios.get('/searchAllAppSyses').then(res => res.data),
    fetchAppSys: async _id => AppSysAxios.post('/fetchAppSys', { _id }).then(res => res.data.AppSys),
    create: async AppSys => AppSysAxios.post('/create', { AppSys }).then(res => res.data.AppSys),
    delete: async _id => AppSysAxios.post('/delete', { _id }),
    update: async AppSys => AppSysAxios.put('/update', { AppSys }),
  };
})();

export default AppSysController;
