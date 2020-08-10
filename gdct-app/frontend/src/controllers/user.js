import axios from 'axios';

import { host } from '../constants/domain';

const userController = (() => {
  const userAxios = axios.create({
    baseURL: `${host}/user_management`,
    withCredentials: true,
  });
  return {
    create: async userData =>
      userAxios.post('/users/registerUser', { userData }).then(res => res.data),
  };
})();

export default userController;
