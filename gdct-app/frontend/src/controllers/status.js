import axios from 'axios';

import { host } from '../constants/domain';

const statusController = (() => {
  const statusAxios = axios.create({
    baseURL: `${host}/designer/statuses`,
    withCredentials: true,
  });
  return {
    fetch: async query => statusAxios.get('').then(res => res.data.statuses),
    create: async status => statusAxios.post('', { status }).then(res => res.data.status),
    delete: async _id => statusAxios.delete(`/${_id}`),
    update: async status => statusAxios.put(`/${status._id}`, { status }),
  };
})();

export default statusController;
