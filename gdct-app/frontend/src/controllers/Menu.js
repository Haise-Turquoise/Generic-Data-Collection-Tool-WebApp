import axios from 'axios';

import { host } from '../constants/domain';

const MenuController = (() => {
  const MenuAxios = axios.create({
    baseURL: `${host}/Menus`,
    withCredentials: true,
  });
  return {
    fetchMenu: async _id => MenuAxios.get(`/${_id}`).then(res => res.data.Menu),
    fetch: async _ => MenuAxios.get('').then(res => res.data.Menus),
    create: async Menu => MenuAxios.post('', { Menu }).then(res => res.data.Menu),
    delete: async _id => MenuAxios.delete(`/${_id}`),
    update: async Menu => MenuAxios.put(`/${Menu._id}`, { Menu }),
  };
})();

export default MenuController;
