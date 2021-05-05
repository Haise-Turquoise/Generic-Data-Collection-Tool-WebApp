import axios from 'axios';

import { host } from '../constants/domain';

const AuthController = (() => {
  const AuthAxios = axios.create({
    baseURL: host,
    withCredentials: true,
  });
  return {
    login: async data => AuthAxios.post('/login', data).then(res => { return res.data; }),
    register: async data => AuthAxios.post('/register', data).then(res => res.data),
    profile: async () => AuthAxios.get('/profile').then(res => res.data),
    logout: async data => AuthAxios.get('/logout', data).then(res => res.data),
  };
})();

export default AuthController;
