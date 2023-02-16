import axios from 'axios';
import Menu from '../types/menu'
import { host } from '../constants/domain';

const MenuController = (() => {
  const MenuAxios = axios.create({
    baseURL: `${host}/Menus`,
    withCredentials: true,
  });
  return {
    fetch: async (role: string): Promise<Menu[]> => MenuAxios.post('', { role }).then(res => res.data.Menus),
  };
})();

export default MenuController;
