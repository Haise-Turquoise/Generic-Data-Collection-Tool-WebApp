import axios from 'axios';

import { host } from '../constants/domain';

const COAGroupController = (() => {
  const COAGroupAxios = axios.create({
    baseURL: `${host}/COA_manager/COAGroups`,
    withCredentials: true,
  });
  return {
    fetch: async _ => COAGroupAxios.get('/fetch').then(res => res.data),
    fetchCOAGroup: async _id => COAGroupAxios.post('/fetchCOAGroup', { _id }).then(res => res.data),
    create: async COAGroup =>
      COAGroupAxios.post('/create', { COAGroup }).then(res => res.data.COAGroup),
    update: async COAGroup => COAGroupAxios.put('update', { COAGroup }),
    delete: async _id => COAGroupAxios.post('/delete', { _id }),
  };
})();

export default COAGroupController;
