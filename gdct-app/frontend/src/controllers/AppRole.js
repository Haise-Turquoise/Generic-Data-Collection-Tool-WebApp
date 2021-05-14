import axios from 'axios';

import { host } from '../constants/domain';

const AppRoleController = (() => {
  const AppRoleAxios = axios.create({
    baseURL: `${host}/role_manager/approles`,
    withCredentials: true,
  });
  return {
    fetch: async _ => AppRoleAxios.get('/fetch').then(res => res.data),
    fetchAppRole: async _id => AppRoleAxios.post('/fetchAppRole', { _id }).then(res => res.data),
    create: async AppRole => AppRoleAxios.post('/create', { AppRole }).then(res => res.data.AppRole),
    delete: async _id => AppRoleAxios.post('/delete', { _id }),
    update: async AppRole => AppRoleAxios.put('/update', { AppRole }),
  };
})();

export default AppRoleController;
