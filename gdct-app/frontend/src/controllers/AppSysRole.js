import axios from 'axios';

import { host } from '../constants/domain';

const AppSysRoleController = (() => {
  const AppSysRoleAxios = axios.create({
    baseURL: `${host}/role_manager/AppSysRoles`,
    withCredentials: true,
  });

  return {
    fetch: async _ => AppSysRoleAxios.get('/fetch').then(res => res.data),
    fetchAppSysRole: async _id => AppSysRoleAxios.post('/fetchAppSysRole', { _id }).then(res => res.data),
    create: async AppSysRole => AppSysRoleAxios.post('/create', { AppSysRole }).then(res => res.data.AppSysRole),
    update: async AppSysRole => AppSysRoleAxios.put('/update', { AppSysRole }),
    delete: async _id => AppSysRoleAxios.post('/delete', { _id }),
  };
})();

export default AppSysRoleController;
