import axios from 'axios';
import TemplatePackage from '../types/templatepackage';
import { host } from '../constants/domain';

const templatePackageController = (() => {
  const templatePackageAxios = axios.create({
    baseURL: `${host}/template_manager/templatePackages`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<TemplatePackage[]> => templatePackageAxios.get('/fetch').then(res => res.data),
    fetchTemplatePackage: async (_id: string): Promise<TemplatePackage | null> =>
      templatePackageAxios.post('/fetchTemplatePackage', { _id }).then(res => res.data),
    create: async (templatePackage: TemplatePackage): Promise<TemplatePackage | null> =>
      templatePackageAxios
        .post('create', { templatePackage })
        .then(res => res.data.templatePackage),
    update: async (templatePackage: Partial<TemplatePackage>) => templatePackageAxios.put('/update', { templatePackage }),
    delete: async (_id: string) => templatePackageAxios.post('/delete', { _id }),
    fetchPopulated: async (_id: string) =>
      templatePackageAxios.post('/fetchPopulated', { _id }).then(res => res.data),
    queryPopulated: async (query?: Partial<TemplatePackage>) =>
      templatePackageAxios.post('/queryPopulated', { query }).then(res => res.data),
    updatePopulated: async (templatePackage: Partial<TemplatePackage>) =>
      templatePackageAxios
        .put('/updatePopulated', { templatePackage })
        .then(res => [res.data.templatePackage]),
  };
})();

export default templatePackageController;
