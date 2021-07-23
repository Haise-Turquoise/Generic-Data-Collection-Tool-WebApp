import axios from 'axios';

import { host } from '../constants/domain';

const masterValueController = (() => {
  const masterValueAxios = axios.create({
    baseURL: `${host}/masterValue`,
    withCredentials: true,
  });
  return {
    fetch: async _ => masterValueAxios.get('/fetch').then(res => res.data.masterValue),
    create: async masterValue =>
      masterValueAxios.post('/create', { masterValue }).then(res => res.data.masterValue),
    update: async masterValue => masterValueAxios.put('/update', { masterValue }),
    delete: async _id => masterValueAxios.post('/delete', { _id }),
    addDocument: async masterValue =>
      masterValueAxios.post('/addDocument', { masterValue }).then(res => res.data.masterValue),
  };
})();

export default masterValueController;
