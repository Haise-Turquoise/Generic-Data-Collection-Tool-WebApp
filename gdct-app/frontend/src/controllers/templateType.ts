import axios from 'axios';
import TemplateType from '../types/templatetype';
import { host } from '../constants/domain';

const templateTypeController = (() => {
  const templateTypeAxios = axios.create({
    baseURL: `${host}/template_manager/templateTypes`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<TemplateType[]> => templateTypeAxios.get('/fetch').then(res => res.data),
    fetchById: async (_id: string): Promise<TemplateType | null> => templateTypeAxios.post('/fetchById', { _id }).then(res => res.data),
    fetchByProgramIds: async (programId: string[]): Promise<TemplateType[]> =>
      templateTypeAxios
        .post('/fetchByProgramIds', { programIds: programId })
        .then(res => res.data.templateTypes),
    create: async (templateType: TemplateType): Promise<TemplateType | null> =>
      templateTypeAxios
        .post('/create', { templateType: { ...templateType, programId: [] } })
        .then(res => res.data.templateType),
    update: async (templateType: Partial<TemplateType>) => templateTypeAxios.put('/update', { templateType }),
    delete: async (_id: string) => templateTypeAxios.post('/delete', { _id }),
    getWorkflowIdByTemplateTypeId: async (_id: string): Promise<string | null> =>
      templateTypeAxios.post('/getWorkflowIdByTemplateTypeId', { _id }).then(res => res.data.workflowId),
  };
})();

export default templateTypeController;
