import axios from 'axios';

import { host } from '../constants/domain';
import Attribute from '../types/attrubute';

const columnNameController = (() => {
  const columnNameAxios = axios.create({
    baseURL: `${host}/COA_manager/columnNames`,
    withCredentials: true,
  });
  return {
    fetch: async (query?: Partial<Attribute>): Promise<Attribute[]> => columnNameAxios.get('/fetch').then(res => res.data),
    fetchAttribute: async (_id: string): Promise<Attribute | null> =>
      columnNameAxios.post('/fetchAttribute', { _id }).then(res => res.data),
    create: async (columnName: Attribute): Promise<Attribute | null> =>
      columnNameAxios.post('/create', { columnName }).then(res => res.data.columnName),
    update: async (columnName: Partial<Attribute>) => columnNameAxios.put('/update', { columnName }),
    delete: async (_id: string) => columnNameAxios.post('/delete', { _id }),
  };
})();

export default columnNameController;
