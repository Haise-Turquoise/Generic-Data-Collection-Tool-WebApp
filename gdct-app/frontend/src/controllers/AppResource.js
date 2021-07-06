import axios from 'axios';

import { host } from '../constants/domain';

const AppResourceController = (() => {
  const AppResourceAxios = axios.create({
    baseURL: `${host}/role_manager/appresources`,
    withCredentials: true,
  });
  return {
    fetchAppResource: async _id =>
      AppResourceAxios.post('/fetchAppResource', { _id }).then(res => res.data),
    fetch: async _ => AppResourceAxios.get('/fetch').then(res => res.data),
    create: async AppResource =>
      AppResourceAxios.post('/create', { AppResource }).then(res => res.data.AppResource),
    delete: async _id => AppResourceAxios.post('/delete', { _id }),
    update: async AppResource => AppResourceAxios.put('/update', { AppResource }),
  };
})();

export default AppResourceController;
