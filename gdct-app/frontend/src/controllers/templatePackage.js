import axios from 'axios';

import { host } from '../constants/domain';

const templatePackageController = (() => {
  const templateAxios = axios.create({
    baseURL: `${host}/template_manager/templatePackages`,
  });
  return {
    fetchTemplatePackage: async _id =>
      templateAxios.get(`/${_id}`).then(res => res.data.templatePackage),
    fetch: async query => templateAxios.get('').then(res => res.data.templatePackages),
    create: async templatePackage =>
      templateAxios.post('', { templatePackage }).then(res => res.data.templatePackage),
    delete: async _id => templateAxios.delete(`/${_id}`),
    update: async templatePackage =>
      templateAxios.put(`/${templatePackage._id}`, { templatePackage }),
  };
})();

export default templatePackageController;
