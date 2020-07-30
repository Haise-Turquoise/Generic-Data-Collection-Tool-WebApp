import axios from 'axios';

import { host } from '../constants/domain';

const AppRoleResourceController = (() => {
  const AppRoleResourceAxios = axios.create({
    baseURL: `${host}/role_manager/approleresources`,
    withCredentials: true,
  });
  return {
    fetchAppRoleResource: async _id =>
      AppRoleResourceAxios.get(`/${_id}`).then(res => res.data.AppRoleResource),
    fetch: async _ => AppRoleResourceAxios.get('').then(res => res.data.AppRoleResources),
    create: async AppRoleResource =>
      AppRoleResourceAxios.post('', { AppRoleResource }).then(res => res.data.AppRoleResource),
    delete: async _id => AppRoleResourceAxios.delete(`/${_id}`),
    update: async AppRoleResource =>
      AppRoleResourceAxios.put(`/${AppRoleResource._id}`, { AppRoleResource }),
  };
})();

export default AppRoleResourceController;
