import axios from 'axios';

import { host } from '../constants/domain';

const programController = (() => {
  const programAxios = axios.create({
    baseURL: `${host}/programs`,
    withCredentials: true,
  });
  return {
    fetchByIds: async ids =>
      programAxios.post(`/searchPrograms`, { ids }).then(res => res.data.programs),
    fetch: async query => programAxios.get('/fetchPrograms').then(res => res.data.programs),
    create: async program =>
      programAxios.post('/createProgram', { program }).then(res => res.data.program),
    delete: async _id => programAxios.delete(`/deleteProgram/${_id}`),
    update: async program => programAxios.put(`/updateProgram/${program._id}`, { program }),
  };
})();

export default programController;
