import axios from 'axios';

import { host } from '../constants/domain';

const spreadSheetController = (() => {
  const sheetNameAxios = axios.create({
    baseURL: `${host}/googleapis_manager`,
    withCredentials: true,
  });
  return {
    fetchCategoryAndAttribute: async () => sheetNameAxios.post('/getAttributesAndCatagory/',  {user: 'google'})
    .then(res => res.data),   
  };
})();

export default spreadSheetController;