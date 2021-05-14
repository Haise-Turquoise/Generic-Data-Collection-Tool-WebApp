import axios from 'axios';

import { host } from '../constants/domain';

const orgController = (() => {
  const orgAxios = axios.create({
    baseURL: `${host}/org_manager/organizations`,
    withCredentials: true,
  });
  return {
    fetch: async () => orgAxios.get('/fetch').then(res => res.data),
    create: async Org => orgAxios.post('/create', { Org }).then(res => res.data.Org),
    update: async Org => orgAxios.put('/update', { Org }),
    delete: async _id => orgAxios.post('/delete', { _id }),
    fetchByOrgGroupId: async orgGroupId =>
      orgAxios.post('/fetchByOrgGroupId', { orgGroupId }).then(res => res.data.organizations),
    fetchById: async Id => orgAxios.post('/fetchById', { Id }).then(res => res.data),
  };
})();

export default orgController;
