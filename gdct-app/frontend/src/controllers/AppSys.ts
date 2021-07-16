import axios from 'axios';

import { host } from '../constants/domain';
import AppSys from '../types/appsys';

const AppSysController = (() => {
  const AppSysAxios = axios.create({
    baseURL: `${host}/role_manager/appSyses`,
    withCredentials: true,
  });

  return {
    fetch: async (): Promise<AppSys[]> => AppSysAxios.get('/searchAllAppSyses').then(res => res.data),
    fetchAppSys: async (_id: string): Promise<AppSys> =>
      AppSysAxios.post('/fetchAppSys', { _id }).then(res => res.data.AppSys),
    create: async (AppSys: AppSys): Promise<AppSys> => AppSysAxios.post('/create', { AppSys }).then(res => res.data.AppSys),
    delete: async (_id: string) => AppSysAxios.post('/delete', { _id }),
    update: async (AppSys: Partial<AppSys>) => AppSysAxios.put('/update', { AppSys }),
  };
})();

export default AppSysController;
