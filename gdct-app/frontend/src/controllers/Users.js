import axios from 'axios';
import { host } from '../constants/domain';

const usersController = (() => {
  const usersAxios = axios.create({
    baseURL: `${host}/admin/user_management`,
    withCredentials: true,
  });
  return {
    fetch: async query => usersAxios.get('/fetch', query).then(res => res.data),
    fetchById: async _id => usersAxios.post('/fetchById', { _id }).then(res => res.data),
    fetchByEmail: async userEmail => usersAxios.post('/fetchByEmail', { userEmail }).then(res => res.data),
    create: async user => usersAxios.post('/create', { user }).then(res => res.data.user),
    update: async user => usersAxios.put('/update', { user }),
    delete: async _id => usersAxios.post('/delete', { _id }),
  };
})();

export default usersController;
