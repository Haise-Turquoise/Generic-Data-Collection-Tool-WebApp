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
    organizationgroupAxios.post('/create', { organizationgroup }).then(res => res.data.orgGroup), 
  update: async (organizationgroup: Partial<OrganizationGroup>) => 
    organizationgroupAxios.put('/update', { organizationgroup }),
  delete: async (_id: string) => 
    organizationgroupAxios.post('/delete', { _id }),
  fetchByIds: async (ids: string[]): Promise<OrganizationGroup[]> =>
    organizationgroupAxios.post(`/searchOrganizationGroups`, { ids }).then(res => res.data.orgGroup),
  fetchById: async (_id: string): Promise<OrganizationGroup | null> =>
    organizationgroupAxios.post('/searchOrganizationGroup', { _id }).then(res => res.data.orgGroup),
  searchAll: async (): Promise<OrganizationGroup[]> =>
    organizationgroupAxios.get(`/searchAllOrganizationGroup`).then(res => res.data.orgGroups),
  fetchLong: async (query: Partial<OrganizationGroup>): Promise<any> => 
  organizationgroupAxios.post('/fetch', { query }).then(res =>res.data),
  getOrganizationGroupName: async (id: string): Promise<any> => 
    organizationgroupAxios.post('/getOrganizationGroupName', { id }).then(res => res.data.orgGroup),
  getOrganizationGroupNames: async (id: string): Promise<any> => 
    organizationgroupAxios.post('/getOrganizationGroupNames', { id }).then(res => res.data.orgGroup),
  getOrganizationGroupIdByOrgName: async (orgName: string): Promise<string[]> => 
    organizationgroupAxios.post('/getOrganizationGroupIdByOrgName', { orgName }).then(res => res.data.orgGroupArray),
};
})(); 

export default organizationGroupController;
