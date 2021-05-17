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
    updatePopulated: async userData => 
      userAxios.put('/updatePopulatedUser', { userData }).then(res => res.data),
    fetchUserByUserName: async username => 
      userAxios.post('/fetchUserByUserName', { username }).then(res => res.data),
  };
})();

export default userController;

