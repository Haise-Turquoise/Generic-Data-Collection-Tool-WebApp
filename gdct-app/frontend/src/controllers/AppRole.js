import axios from 'axios';

import { host } from '../constants/domain';

const AppRoleController = (() => {
  const AppRoleAxios = axios.create({
    baseURL: `${host}/role_manager/approles`,
    withCredentials: true,
  });
  return {
    fetchAppRole: async _id => AppRoleAxios.get(`/${_id}`).then(res => res.data.AppRole),
    fetch: async _ => AppRoleAxios.get('').then(res => res.data.AppRoles),
    create: async AppRole => AppRoleAxios.post('', { AppRole }).then(res => res.data.AppRole),
    delete: async _id => AppRoleAxios.delete(`/${_id}`),
    update: async AppRole => AppRoleAxios.put(`/${AppRole._id}`, { AppRole }),
  };
})();

export default AppRoleController;
