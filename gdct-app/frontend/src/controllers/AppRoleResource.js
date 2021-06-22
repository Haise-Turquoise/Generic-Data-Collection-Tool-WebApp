import axios from 'axios';

import { host } from '../constants/domain';

const AppRoleResourceController = (() => {
  const AppRoleResourceAxios = axios.create({
    baseURL: `${host}/role_manager/approleresources`,
    withCredentials: true,
  });
  return {
    fetch: async _ => AppRoleResourceAxios.get('/fetch').then(res => res.data),
    fetchAppRoleResource: async _id =>
      AppRoleResourceAxios.post('/fetchAppRoleResource', { _id }).then(res => res.data),
    create: async AppRoleResource =>
      AppRoleResourceAxios.post('/create', { AppRoleResource }).then(
        res => res.data.AppRoleResource,
      ),
    update: async AppRoleResource => AppRoleResourceAxios.put('/update', { AppRoleResource }),
    delete: async _id => AppRoleResourceAxios.post('/delete', { _id }),
  };
})();

export default AppRoleResourceController;
