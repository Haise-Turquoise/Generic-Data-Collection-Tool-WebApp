import axios from 'axios';

import { host } from '../constants/domain';

const roleWorkflowStatusController = (() => {
  const roleWorkflowStatus = axios.create({
    baseURL: `${host}/roleWorkflowStatus`,
    withCredentials: true,
  });
  return {
    fetchStatusByRole: async (role)=> roleWorkflowStatus.post(`/fetchByRole`, {role}).then(data=>data.data.roleData)
  };
})();

export default roleWorkflowStatusController;