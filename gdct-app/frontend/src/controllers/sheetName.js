import axios from 'axios';

import { host } from '../constants/domain';

const sheetNameController = (() => {
  const sheetNameAxios = axios.create({
    baseURL: `${host}/sheetNames`,
  });
  return {
    fetch: async query => sheetNameAxios.get('').then(res => res.data.sheetNames),
    create: async sheetName =>
      sheetNameAxios.post('', { sheetName }).then(res => res.data.sheetName),
    delete: async _id => sheetNameAxios.delete(`/${_id}`),
    update: async sheetName => sheetNameAxios.put(`/${sheetName._id}`, { sheetName }),
  };
})();

export default sheetNameController;
