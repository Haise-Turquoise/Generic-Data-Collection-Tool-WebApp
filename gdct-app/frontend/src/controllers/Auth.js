import axios from 'axios';

import { host } from '../constants/domain';

const AuthController = (() => {
  const AuthAxios = axios.create({
    baseURL: host,
    withCredentials: true,
  });
  return {
    login: async data =>
      AuthAxios.post('/login', data)
        .then(res => res.data)
        .catch(err => console.log(err)),
    register: async data =>
      AuthAxios.post('/register', data)
        .then(res => res.data)
        .catch(err => console.log(err)),
    auto: async data => AuthAxios.get('/auth/auto/callback'),
    profile: async () => AuthAxios.get('/profile').then(res => res.data),
    logout: async data => AuthAxios.get('/logout').then(res => res.data),
  };
})();

export default AuthController;
