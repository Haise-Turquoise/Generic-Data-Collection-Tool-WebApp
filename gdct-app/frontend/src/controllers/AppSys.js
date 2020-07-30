import axios from 'axios';

import { host } from '../constants/domain';

const AppSysController = (() => {
  const AppSysAxios = axios.create({
    baseURL: `${host}/role_manager/appSyses`,
    withCredentials: true,
  });

  return {
    fetchAppSys: async _id => AppSysAxios.get(`/${_id}`).then(res => res.data.AppSys),
    fetch: async () => AppSysAxios.get('/searchAllAppSyses').then(res => res.data.AppSyses),
    create: async AppSys => AppSysAxios.post('', { AppSys }).then(res => res.data.AppSys),
    delete: async _id => AppSysAxios.delete(`/${_id}`),
    update: async AppSys => AppSysAxios.put(`/${AppSys._id}`, { AppSys }),
  };
})();

export default AppSysController;
