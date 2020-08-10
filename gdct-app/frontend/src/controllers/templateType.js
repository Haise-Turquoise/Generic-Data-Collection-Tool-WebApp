import axios from 'axios';

import { host } from '../constants/domain';

const templateTypeController = (() => {
  const templateTypeAxios = axios.create({
    baseURL: `${host}/template_manager/templateTypes`,
    withCredentials: true,
  });
  return {
    fetch: async query =>
      templateTypeAxios.get('/fetchTemplateType').then(res => res.data.templateTypes),

    fetchByProgramIds: async programIds =>
      templateTypeAxios
        .post(`/searchTemplateTypeByProgramIds`, { programIds })
        .then(res => res.data.templateTypes),
    create: async templateType =>
      templateTypeAxios
        .post('/createTemplateType', {
          templateType: {
            ...templateType,
            programIds: [],
          },
        })
        .then(res => res.data.templateType),
    delete: async _id => templateTypeAxios.delete(`/deleteTemplateType/${_id}`),
    update: async templateType =>
      templateTypeAxios.put(`/updateTemplateType/${templateType._id}`, { templateType }),
  };
})();

export default templateTypeController;
