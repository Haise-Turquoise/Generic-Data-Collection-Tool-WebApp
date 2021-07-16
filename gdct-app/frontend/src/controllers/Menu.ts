import axios from 'axios';
import { Menu } from '../types/menu'
import { host } from '../constants/domain';

const MenuController = (() => {
  const MenuAxios = axios.create({
    baseURL: `${host}/Menus`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<Menu[]> => MenuAxios.get('').then(res => res.data.Menus),
  };
})();

export default MenuController;
