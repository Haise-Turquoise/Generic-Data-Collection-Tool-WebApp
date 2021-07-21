import axios from 'axios';
import Organization from '../types/organization';
import { host } from '../constants/domain';

const orgController = (() => {
  const orgAxios = axios.create({
    baseURL: `${host}/org_manager/organizations`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<Organization[]> => orgAxios.get('/fetch').then(res => res.data),
    create: async (Org: Organization): Promise<Organization | null> => orgAxios.post('/create', { Org }).then(res => res.data.Org),
    update: async (Org: Partial<Organization>) => orgAxios.put('/update', { Org }),
    delete: async (_id: string) => orgAxios.post('/delete', { _id }),
    fetchByOrgGroupId: async (orgGroupId: string): Promise<Organization[]> =>
      orgAxios.post('/fetchByOrgGroupId', { orgGroupId }).then(res => res.data.organizations),
    fetchById: async (Id: number): Promise<Organization | null> => orgAxios.post('/fetchById', { Id }).then(res => res.data),
  };
})();

export default orgController;
