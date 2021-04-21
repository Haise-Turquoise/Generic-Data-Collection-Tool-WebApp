import axios from 'axios';
import { host } from '../constants/domain';

const usersController = (() => {
  const usersAxios = axios.create({
    baseURL: `${host}/admin/user_management`,
    withCredentials: true,
  });
  return {
    fetch: async query => usersAxios.get('/getUserInfo', query).then(res => res.data.users),
    fetchById: async _id => usersAxios.get('/fetchById', { params: _id }).then(res => res.data),
    fetchByEmail: async userEmail => usersAxios.get(`/fetchByEmail/${userEmail}`).then(res => res.data),
    create: async user => usersAxios.post('', { user }).then(res => res.data.user),
    delete: async _id => usersAxios.delete(`/${_id}`),
    update: async user => usersAxios.put(`/updateUserInfo/${user._id}`, { user }),
  };
})();

export default usersController;
