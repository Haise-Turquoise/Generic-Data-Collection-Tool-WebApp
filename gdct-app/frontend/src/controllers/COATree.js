import axios from 'axios';

import { host } from '../constants/domain';

const COATreeController = (() => {
  const COATreeAxios = axios.create({
    baseURL: `${host}/COA_manager/COATrees`,
    withCredentials: true,
  });
  return {
    fetchCOATree: async _id => COATreeAxios.post('/fetchCOATree', { _id }).then(res => res.data.COATree),
    fetchBySheetName: async _id => COATreeAxios.post(`/sheetName/fetchBySheetName`, { _id }).then(res => res.data.COATrees),
    fetch: async query => COATreeAxios.get('/fetch').then(res => res.data.COATrees),
    create: async COATree => COATreeAxios.post('/create', { COATree }).then(res => res.data.COATree),
    update: async COATree => COATreeAxios.put('/update', { COATree }),
    delete: async _id => COATreeAxios.post('/delete', { _id }),
    updateBySheetName: async (COATrees, sheetNameId) => COATreeAxios.put(`/sheetName/updateBySheetName`, { sheetNameId, COATrees }),
  };
})();

export default COATreeController;
