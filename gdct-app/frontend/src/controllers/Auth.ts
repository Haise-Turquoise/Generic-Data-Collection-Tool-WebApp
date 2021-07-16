import axios, { AxiosResponse } from 'axios';

import { host } from '../constants/domain';
import { authRes, loginParams, loginRes, registerParams } from '../types/auth';

const AuthController = (() => {
  const AuthAxios = axios.create({
    baseURL: host,
    withCredentials: true,
  });
  return {
    login: async (data: loginParams): Promise<loginRes> => 
      AuthAxios.post('/login', data).then(res => res.data),
    register: async (data: registerParams) =>
      AuthAxios.post('/register', data).then(res => {console.log('DATA', res.data); return res.data}),
    profile: async (): Promise<authRes> => AuthAxios.get('/profile').then(res => res.data),
    logout: async (): Promise<authRes> => AuthAxios.get('/logout').then(res => res.data),
  };
})();

export default AuthController;
