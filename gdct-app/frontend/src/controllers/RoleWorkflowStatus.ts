import axios from 'axios';
import RoleWorkflowStatus from '../types/roleWorkflowStatus';
import { host } from '../constants/domain';

const roleWorkflowStatusController = (() => {
  const roleWorkflowStatus = axios.create({
    baseURL: `${host}/roleWorkflowStatus`,
    withCredentials: true,
  });
  return {
    fetchStatusByRole: async (role: string): Promise<RoleWorkflowStatus> => roleWorkflowStatus.post(`/fetchByRole`, {role}).then(data=>data.data.roleData),
    findAll: async (): Promise<RoleWorkflowStatus[]> => roleWorkflowStatus.get('/findAll').then(data=>data.data.roleData),
    create: async (item: RoleWorkflowStatus): Promise<RoleWorkflowStatus> => roleWorkflowStatus.post('/create', { item }).then(data=>data.data.roleData),
    update: async (_id: string, item: Partial<RoleWorkflowStatus>) => roleWorkflowStatus.post('/update', {_id, item})
  };
})();

export default roleWorkflowStatusController;