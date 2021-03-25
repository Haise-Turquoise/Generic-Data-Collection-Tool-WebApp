import axios from 'axios';

import { host } from '../constants/domain';

const sheetNameController = (() => {
  const sheetNameAxios = axios.create({
    baseURL: `${host}/sheetNames`,
    withCredentials: true,
  });
  return {
    fetch: async query => sheetNameAxios.get('').then(res => res.data.sheetNames),
    fetchById: async _id => sheetNameAxios.get(`/${_id}`).then(res => res.data),
    create: async sheetName => sheetNameAxios.post('', { sheetName }).then(res => res.data.sheetName),
    delete: async _id => sheetNameAxios.delete(`/${_id}`),
    update: async sheetName => sheetNameAxios.put(`/${sheetName._id}`, { sheetName }),
  };
})();

export default sheetNameController;
