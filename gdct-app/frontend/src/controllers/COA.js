import axios from 'axios';

import { host } from '../constants/domain';

const COAController = (() => {
  const COAAxios = axios.create({
    baseURL: `${host}/COA_manager/COAs`,
    withCredentials: true,
  });

  return {
    fetchCOA: async _id => COAAxios.get(`/${_id}`).then(res => res.data.COA),
    fetch: async () => COAAxios.get('').then(res => res.data.COAs),
    create: async COA => COAAxios.post('', { COA }).then(res => res.data.COA),
    delete: async _id => COAAxios.delete(`/${_id}`),
    update: async COA => COAAxios.put(`/${COA._id}`, { COA }),
  };
})();

export default COAController;
