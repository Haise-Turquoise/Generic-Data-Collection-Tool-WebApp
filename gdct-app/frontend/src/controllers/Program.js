import axios from 'axios';

import { host } from '../constants/domain';

const programController = (() => {
  const programAxios = axios.create({
    baseURL: `${host}/programs`,
    withCredentials: true,
  });
  return {
    fetch: async _ => programAxios.get('/fetch').then(res => res.data),
    create: async program => programAxios.post('/create', { program }).then(res => res.data.program),
    update: async program => programAxios.put('/update', { program }),
    delete: async _id => programAxios.post('/delete', { _id }),
    fetchByIds: async ids => programAxios.post(`/searchPrograms`, { ids }).then(res => res.data.programs),
    fetchById: async _id => programAxios.post('/searchProgram', { _id }).then(res => res.data.program),
  };
})();

export default programController;
