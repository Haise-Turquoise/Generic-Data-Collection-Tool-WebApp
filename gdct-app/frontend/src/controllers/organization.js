import axios from 'axios';

import { host } from '../constants/domain';

const orgController = (() => {
  const orgAxios = axios.create({
    baseURL: `${host}/org_manager/organizations`,
    withCredentials: true,
  });
  return {
    fetchOrg: async _id => orgAxios.get(`/fetchOrganization/${_id}`).then(res => res.data.Org),
    fetch: async () => orgAxios.get('/fetchOrganizations').then(res => res.data.Orgs),
    create: async Org => orgAxios.post('/createOrganization', { Org }).then(res => res.data.Org),
    delete: async _id => orgAxios.delete(`/deleteOrganization/${_id}`),
    update: async Org => orgAxios.put(`/updateOrganization/${Org._id}`, { Org }),
    fetchByOrgGroupId: async orgGroupId =>
      orgAxios.get(`/searchOrgByOrgGroupId/${orgGroupId}`).then(res => res.data.organizations),
  };
})();

export default orgController;
