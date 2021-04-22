import axios from 'axios';

import { host } from '../constants/domain';

const sessionController = (() => {
  const sessionAxios = axios.create({
    baseURL: `${host}/session`,
    // withCredentials: true,
  });
  return {
    touchCommand: async () => sessionAxios.get('touch').then(res => res.data),
    fetch: async () => sessionAxios.get('').then(res => res.data),
    fetchById: async _id => sessionAxios.get(`${_id}`).then(res => res.data),
    updateExpiration: async _id => sessionAxios.put(`${_id}`).then(res => res.data)
  };
})();


export default sessionController;
