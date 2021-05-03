import axios from 'axios';

import { host } from '../constants/domain';

const userController = (() => {
  const userAxios = axios.create({
    baseURL: `${host}/user_management`,
    withCredentials: true,
  });
  return {
    create: async userData => userAxios.post('/users/registerUser', { userData }).then(res => res.data),
    updatePopulated: async userData => userAxios.put(`/${userData._id}`, { userData }).then(res => res.data),
    fetchUserByUserName: async username => userAxios.get(`/${username}`).then(res => res.data),
    

    updatePermissionByUserEmail: async (email, permissionData)=>
      userAxios.post(`/users/updatePermission/${email}`, {permissionData}).then(res=>res.data),
    
  };
})();

export default userController;

