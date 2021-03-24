import axios from 'axios';
import { urlParser } from '../tools/misc'

import { host } from '../constants/domain';

const spreadSheetController = (() => {
  const sheetNameAxios = axios.create({
    baseURL: `${host}/googleapis_manager`,
    withCredentials: true,
  });

  return {
    fetchCategoryAndAttribute: async () => sheetNameAxios.post('/getAttributesAndCatagory/',  {user: 'google'})
    .then(res => res.data), 

    fetchByOrgID: async (orgID, categories, attributes) => axios.get(urlParser(orgID, categories, attributes), {headers:{'Access-Control-Allow-Credentials':true}})
    .then(res => res.data.data),

    fetchOrg: async () => sheetNameAxios.post('/orgWithMasterValueEntry', {user: 'google'})
    .then(res => res.data),
  };
})();

export default spreadSheetController;