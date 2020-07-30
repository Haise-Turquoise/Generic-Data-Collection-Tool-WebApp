import axios from 'axios';

import { host } from '../constants/domain';

const AppSysRoleController = (() => {
  const AppSysRoleAxios = axios.create({
    baseURL: `${host}/role_manager/AppSysRoles`,
    withCredentials: true,
  });

  return {
    fetchAppSysRole: async _id => AppSysRoleAxios.get(`/${_id}`).then(res => res.data.AppSysRole),
    fetch: async _ => AppSysRoleAxios.get('').then(res => res.data.AppSysRoles),
    create: async AppSysRole =>
      AppSysRoleAxios.post('', { AppSysRole }).then(res => res.data.AppSysRole),
    delete: async _id => AppSysRoleAxios.delete(`/${_id}`),
    update: async AppSysRole => AppSysRoleAxios.put(`/${AppSysRole._id}`, { AppSysRole }),
  };
})();

export default AppSysRoleController;
