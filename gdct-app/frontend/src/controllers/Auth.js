import axios from 'axios';

import { host } from '../constants/domain';

const AuthController = (() => {
  const AuthAxios = axios.create({
    baseURL: host,
    timeout: 5000, // 0 is default, which is no timeout
    withCredentials: true,
  });
  return {
    login: async data => AuthAxios.post('/login', data)
      .then(res => { return res.data; })
      .catch(err => console.log(err)),

    register: async data => AuthAxios.post('/register', data)
      .then(res => res.data)
      .catch(err => console.log(err)),

    auto: async data => AuthAxios.get('/auth/auto/callback'),

    profile: async () => AuthAxios.get('/profile')
      .then(res => res.data)
      .catch(err => console.log(err)),

    logout: async data => AuthAxios.get('/logout', data)
      .then(res => res.data),
  };
})();

export default AuthController;
