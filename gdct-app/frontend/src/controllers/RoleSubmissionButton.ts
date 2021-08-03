import axios from 'axios';

import { host } from '../constants/domain';

const roleSubmissionButtonController = (() => {
  const roleSubmissionButton = axios.create({
    baseURL: `${host}/roleSubmissionButton`,
    withCredentials: true,
  });
  return {
    fetchSubmissionButtonByRole: async (role:string)=> roleSubmissionButton.post(`/fetchByRole`, {role}).then(data=>data.data.roleData)
  };
})();

export default roleSubmissionButtonController;