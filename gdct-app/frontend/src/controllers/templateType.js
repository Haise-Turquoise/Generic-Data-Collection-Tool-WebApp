import axios from 'axios';

import { host } from '../constants/domain';

const templateTypeController = (() => {
  const templateTypeAxios = axios.create({
    baseURL: `${host}/template_manager/templateTypes`,
    withCredentials: true,
  });
  return {
    fetch: async _ => templateTypeAxios.get('/fetch').then(res => res.data),
    fetchById: async _id => templateTypeAxios.post('/fetchById', { _id }).then(res => res.data),
    fetchByProgramIds: async programIds =>
      templateTypeAxios
        .post('/fetchByProgramIds', { programIds })
        .then(res => res.data.templateTypes),
    create: async templateType =>
      templateTypeAxios
        .post('/create', { templateType: { ...templateType, programIds: [] } })
        .then(res => res.data.templateType),
    update: async templateType => templateTypeAxios.put('/update', { templateType }),
    delete: async _id => templateTypeAxios.post('/delete', { _id }),
  };
})();

export default templateTypeController;
