import axios from 'axios';

import { host } from '../constants/domain';

const columnNameController = (() => {
  const columnNameAxios = axios.create({
    baseURL: `${host}/COA_manager/columnNames`,
    withCredentials: true,
  });
  return {
    fetch: async query => columnNameAxios.get('/fetch').then(res => res.data),
    fetchAttribute: async _id =>
      columnNameAxios.post('/fetchAttribute', { _id }).then(res => res.data),
    create: async columnName =>
      columnNameAxios.post('/create', { columnName }).then(res => res.data.columnName),
    update: async columnName => columnNameAxios.put('/update', { columnName }),
    delete: async _id => columnNameAxios.post('/delete', { _id }),
  };
})();

export default columnNameController;
