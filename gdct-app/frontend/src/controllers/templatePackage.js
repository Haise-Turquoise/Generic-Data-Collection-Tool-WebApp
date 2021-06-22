import axios from 'axios';

import { host } from '../constants/domain';

const templatePackageController = (() => {
  const templatePackageAxios = axios.create({
    baseURL: `${host}/template_manager/templatePackages`,
    withCredentials: true,
  });
  return {
    fetch: async _ => templatePackageAxios.get('/fetch').then(res => res.data),
    fetchTemplatePackage: async _id =>
      templatePackageAxios.post('/fetchTemplatePackage', { _id }).then(res => res.data),
    create: async templatePackage =>
      templatePackageAxios
        .post('create', { templatePackage })
        .then(res => res.data.templatePackage),
    update: async templatePackage => templatePackageAxios.put('/update', { templatePackage }),
    delete: async _id => templatePackageAxios.post('/delete', { _id }),
    fetchPopulated: async _id =>
      templatePackageAxios.post('/fetchPopulated', { _id }).then(res => res.data),
    updatePopulated: async templatePackage =>
      templatePackageAxios
        .put('/updatePopulated', { templatePackage })
        .then(res => [res.data.templatePackage]),
  };
})();

export default templatePackageController;
