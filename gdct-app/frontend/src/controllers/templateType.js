import axios from 'axios';

const templateTypeController = (() => {
  const templateTypeAxios = axios.create({
    baseURL: 'http://localhost:3000/template_manager/templateTypes',
  });
  return {
    fetch: async query => templateTypeAxios.get(`/fetchTemplateType`).then(res => res.data.templateTypes),
    fetchByProgramIds: async programIds =>
      templateTypeAxios.post(`/createTemplateType`, { programIds }).then(res => res.data.templateTypes),
    create: async templateType =>
      templateTypeAxios
        .post(`/createTemplateType`, {
          templateType: {
            ...templateType,
            programIds: [],
          },
        })
        .then(res => res.data.templateType),
    delete: async _id => templateTypeAxios.delete(`/deleteTemplateType/${_id}`),
    update: async templateType => templateTypeAxios.put(`/updateTemplateType/${templateType._id}`, { templateType }),
  };
})();

export default templateTypeController;
