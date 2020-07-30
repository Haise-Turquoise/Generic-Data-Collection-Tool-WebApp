import axios from 'axios';

import { host } from '../constants/domain';

const organizationGroupController = (() => {
  const organizationGroupAxios = axios.create({
    baseURL: `${host}/orgGroup_manager/orgGroups`,
  });
  return {
    fetch: async () =>
      organizationGroupAxios.get(`/searchOrganizationGroup`).then(res => res.data.orgGroups),
  };
})();

export default organizationGroupController;
