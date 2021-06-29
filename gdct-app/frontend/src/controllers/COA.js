import axios from 'axios';

import { host } from '../constants/domain';

const COAController = (() => {
  const COAAxios = axios.create({
    baseURL: `${host}/COA_manager/COAs`,
    withCredentials: true,
  });

  return {
    fetch: async () => COAAxios.get('/fetch').then(res => res.data),
    fetchCOAbyId: async _id => COAAxios.post('/fetchCOAById', { _id }).then(res => res.data),
    create: async COA => COAAxios.post('/create', { COA }).then(res => res.data.COA),
    update: async COA => COAAxios.put('/update', { COA }),
    delete: async _id => COAAxios.post('/delete', { _id }),
  };
})();

export default COAController;
