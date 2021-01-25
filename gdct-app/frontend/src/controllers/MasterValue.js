import axios from 'axios';

import { host } from '../constants/domain';

const masterValueController = (() => {
  const masterValueAxios = axios.create({
    baseURL: `${host}/masterValue`,
    withCredentials: true,
  });
  return {
    fetch: async query => masterValueAxios.get('').then(res => res.data.masterValue),
    create: async masterValue =>
      masterValueAxios.post('', { masterValue }).then(res => res.data.masterValue),
    delete: async _id => masterValueAxios.delete(`/${_id}`),
    update: async masterValue => masterValueAxios.put(`/${masterValue._id}`, { masterValue }),
    addDocument: async masterValue =>
      masterValueAxios.post('/addDocument', { masterValue }).then(res => res.data.masterValue),
  };
})();

export default masterValueController;
