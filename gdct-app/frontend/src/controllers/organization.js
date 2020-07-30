import axios from 'axios';

import { host } from '../constants/domain';

const orgController = (() => {
  const orgAxios = axios.create({
    baseURL: `${host}/org_manager/organizations`,
  });
  return {
    fetchOrg: async _id => orgAxios.get(`/${_id}/get`).then(res => res.data.Org),
    fetch: async () => orgAxios.get('/get').then(res => res.data.Orgs),
    create: async Org => orgAxios.post('/create', { Org }).then(res => res.data.Org),
    delete: async _id => orgAxios.delete(`/${_id}/delete`),
    update: async Org => orgAxios.put(`/${Org._id}/update`, { Org }),
    fetchByOrgGroupId: async orgGroupId =>
      orgAxios.get(`/searchOrgByOrgGroupId/${orgGroupId}`).then(res => res.data.organizations),
  };
})();

export default orgController;
