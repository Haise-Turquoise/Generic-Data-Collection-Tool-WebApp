import axios from 'axios';

import { host } from '../constants/domain';

const sessionController = (() => {
  const sessionAxios = axios.create({
    baseURL: `${host}/session`,
    // withCredentials: true,
  });
  return {
    fetchById: async _id => sessionAxios.post('/fetchById', { _id }).then(res => res.data),
    updateExpiration: async _id => sessionAxios.put('/updateExpiration', { _id }).then(res => res.data)
  };
})();

export default sessionController;
