import axios from 'axios';

import { host } from '../constants/domain';
import RoleSubmissionButton from '../types/rolesubmissionbutton';

const roleSubmissionButtonController = (() => {
  const roleSubmissionButton = axios.create({
    baseURL: `${host}/roleSubmissionButton`,
    withCredentials: true,
  });
  return {
    fetchSubmissionButtonByRole: async (role:string): Promise<RoleSubmissionButton> => roleSubmissionButton.post(`/fetchByRole`, {role}).then(data=>data.data.roleData),
    create: async (item: RoleSubmissionButton): Promise<RoleSubmissionButton> => roleSubmissionButton.post('/create', { item }).then(data=>data.data.roleData),
    update: async (RoleSubmissionButton: RoleSubmissionButton) => roleSubmissionButton.post('/update', { RoleSubmissionButton }),
  };
})();

export default roleSubmissionButtonController;