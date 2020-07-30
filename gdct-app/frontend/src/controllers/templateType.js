import axios from 'axios';

import { host } from '../constants/domain';

const templateTypeController = (() => {
  const templateTypeAxios = axios.create({
    baseURL: `${host}/template_manager/templateTypes`,
  });
  return {
    fetch: async query => templateTypeAxios.get('').then(res => res.data.templateTypes),

    fetchByProgramIds: async programIds =>
      templateTypeAxios
        .post(`/searchTemplateTypeByProgramIds`, { programIds })
        .then(res => res.data.templateTypes),
    create: async templateType =>
      templateTypeAxios
        .post('', {
          templateType: {
            ...templateType,
            programIds: [],
          },
        })
        .then(res => res.data.templateType),
    delete: async _id => templateTypeAxios.delete(`/${_id}`),
    update: async templateType => templateTypeAxios.put(`/${templateType._id}`, { templateType }),
  };
})();

export default templateTypeController;
