import axios from 'axios';

import { host } from '../constants/domain';

const sheetNameController = (() => {
  const sheetNameAxios = axios.create({
    baseURL: `${host}/sheetNames`,
    withCredentials: true,
  });
  return {
    fetch: async _ => sheetNameAxios.get('/fetch').then(res => res.data),
    fetchById: async _id => sheetNameAxios.post('/fetchById', { _id }).then(res => res.data),
    create: async sheetName => sheetNameAxios.post('/create', { sheetName }).then(res => res.data.sheetName),
    update: async sheetName => sheetNameAxios.put('/update', { sheetName }),
    delete: async _id => sheetNameAxios.post('/delete', { _id }),
  };
})();

export default sheetNameController;
