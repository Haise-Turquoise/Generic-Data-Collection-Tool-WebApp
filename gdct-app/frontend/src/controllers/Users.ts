import axios from 'axios';
import User from '../types/user';
import { host } from '../constants/domain';

const usersController = (() => {
  const usersAxios = axios.create({
    baseURL: `${host}/admin/user_management`,
    withCredentials: true,
  });
  return {
    fetch: async (query?: any): Promise<User[]> => usersAxios.get('/fetch', query).then(res => res.data),
    fetchById: async (_id: string): Promise<User | null> => usersAxios.post('/fetchById', { _id }).then(res => res.data),
    fetchByEmail: async (userEmail: string): Promise<User | null> =>
      usersAxios.post('/fetchByEmail', { userEmail }).then(res => res.data),
    create: async (user: User): Promise<User | null> => usersAxios.post('/create', { user }).then(res => res.data.user),
    update: async (user: User) => usersAxios.put('/update', { user }),
    delete: async (_id: string) => usersAxios.post('/delete', { _id }),
  };
})();

export default usersController;
