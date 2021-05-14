import axios from 'axios';

import { host } from '../constants/domain';

const MenuController = (() => {
  const MenuAxios = axios.create({
    baseURL: `${host}/Menus`,
    withCredentials: true,
  });
  return {
    fetch: async _ => MenuAxios.get('').then(res => res.data.Menus),
  };
})();

export default MenuController;
