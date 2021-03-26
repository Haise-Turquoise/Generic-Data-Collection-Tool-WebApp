import axios from 'axios';

import { host } from '../constants/domain';

const COAGroupController = (() => {
  const COAGroupAxios = axios.create({
    baseURL: `${host}/COA_manager/COAGroups`,
    withCredentials: true,
  });
  return {
    fetch: async _ => COAGroupAxios.get('').then(res => res.data.COAGroups),
    fetchCOAGroup: async _id => COAGroupAxios.get(`${_id}`).then(res => res.data),
    create: async COAGroup => COAGroupAxios.post('', { COAGroup }).then(res => res.data.COAGroup),
    delete: async _id => COAGroupAxios.delete(`/${_id}`),
    update: async COAGroup => COAGroupAxios.put(`/${COAGroup._id}`, { COAGroup }),
  };
})();

export default COAGroupController;
