import axios from 'axios';

import { host } from '../constants/domain';

const COATreeController = (() => {
  const COATreeAxios = axios.create({
    baseURL: `${host}/COA_manager/COATrees`,
    withCredentials: true,
  });
  return {
    fetchCOATree: async _id => COATreeAxios.get(`/${_id}`).then(res => res.data.COATree),
    fetchBySheetName: async _id =>
      COATreeAxios.get(`/sheetName/${_id}`).then(res => res.data.COATrees),
    fetch: async query => COATreeAxios.get('').then(res => res.data.COATrees),
    create: async COATree => COATreeAxios.post('', { COATree }).then(res => res.data.COATree),
    delete: async _id => COATreeAxios.delete(`/${_id}`),
    update: async COATree => COATreeAxios.put(`/${COATree._id}`, { COATree }),
    updateBySheetName: async (COATrees, sheetNameId) =>
      COATreeAxios.put(`/sheetName/${sheetNameId}`, { COATrees }),
  };
})();

export default COATreeController;
