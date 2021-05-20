import axios from 'axios';

import { host } from '../constants/domain';

const statusController = (() => {
  const statusAxios = axios.create({
    baseURL: `${host}/designer/statuses`,
    withCredentials: true,
  });
  return {
    fetch: async _ => statusAxios.get('/fetch').then(res => res.data),
    fetchStatus: async _id => statusAxios.post('/fetchStatus', { _id }).then(res => res.data.status),
    create: async status => statusAxios.post('/create', { status }).then(res => res.data.status),
    update: async status => statusAxios.put('/update', { status }),
    delete: async _id => statusAxios.post('/delete', { _id }),
    findStatusByID: async _id => statusAxios.post('/findStatusByID', { _id }).then(res => res.data)
  };
})();

export default statusController;
