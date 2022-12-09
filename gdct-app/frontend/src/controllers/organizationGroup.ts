import axios from 'axios';
import OrganizationGroup from '../types/organizationgroup';
import { host } from '../constants/domain';

const organizationGroupController = (() => {
  const organizationgroupAxios = axios.create({
    baseURL: `${host}/organization/group`,
    withCredentials: true,
  });
  return { 
    fetch: async (): Promise<OrganizationGroup[]> =>
      organizationgroupAxios.get('/fetch').then(res => res.data),
    create: async (organizationgroup: OrganizationGroup): Promise<OrganizationGroup | null> => 
      organizationgroupAxios.post('/create', { organizationgroup }).then(res => res.data.organizationgroup), 
    update: async (organizationgroup: Partial<OrganizationGroup>) => organizationgroupAxios.put('/update', { organizationgroup }),
    delete: async (_id: string) => organizationgroupAxios.post('/delete', { _id }),
    fetchByIds: async (ids: string[]): Promise<OrganizationGroup[]> =>
      organizationgroupAxios.post(`/searchOrganizationGroups`, { ids }).then(res => res.data.organizationgroups),
    fetchById: async (_id: string): Promise<OrganizationGroup | null> =>
      organizationgroupAxios.post('/searchOrganizationGroup', { _id }).then(res => res.data.organizationgroup),
   
  };
})(); 

export default organizationGroupController;
