import axios from 'axios';

import { host } from '../constants/domain';

const AppResourceController = (() => {
  const AppResourceAxios = axios.create({
    baseURL: `${host}/role_manager/appresources`,
    withCredentials: true,
  });
  return {
    fetchAppResource: async _id =>
      AppResourceAxios.get(`/${_id}`).then(res => res.data.AppResource),
    fetch: async _ =>
      AppResourceAxios.get('').then(res => {
        console.log('res:', res);
        return res.data.AppResources;
      }),
    create: async AppResource =>
      AppResourceAxios.post('', { AppResource }).then(res => res.data.AppResource),
    delete: async _id => AppResourceAxios.delete(`/${_id}`),
    update: async AppResource => AppResourceAxios.put(`/${AppResource._id}`, { AppResource }),
  };
})();

export default AppResourceController;
