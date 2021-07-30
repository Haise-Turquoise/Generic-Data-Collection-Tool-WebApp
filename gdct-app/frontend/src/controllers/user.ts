import axios from 'axios';
import User, { RawData } from '../types/user';
import { host } from '../constants/domain';

const userController = (() => {
  const userAxios = axios.create({
    baseURL: `${host}/user_management`,
    withCredentials: true,
  });

  return {
    create: async (userData: User): Promise<User | null> =>
      userAxios.post('/users/registerUser', { userData }).then(res => res.data),
    updatePopulated: async (userData: Partial<User>): Promise<User | null> =>
      userAxios.put('/updatePopulatedUser', { userData }).then(res => res.data),
    updateToBeApproved: async (userData: User): Promise<User | null> =>
      userAxios.put('/updateToBeApprovedUser', { userData }).then(res => res.data),
    updatePendingPermissions: async (userData: User): Promise<User | null> =>
      userAxios.put('/updatePendingPermissions', { userData }).then(res => res.data),
    fetchUserByUserName: async (username: string): Promise<{user: User | null}> =>
      userAxios.post('/fetchUserByUserName', { username }).then(res => res.data),
    updatePermissionByUserEmail: async (email: string, permissionData: RawData): Promise<void> =>
      userAxios.post(`/users/updatePermission`, {email, permissionData}).then(res => res.data),
    deletePermissionByUserEmail: async (email: string, permissionData: RawData): Promise<User | null> =>
      userAxios.post(`/users/deletePermission`, {email, permissionData}).then(res => res.data),
  };
})();

export default userController;
