import axios from 'axios';
import Template from '../types/template';
import { host } from '../constants/domain';

const templateController = (() => {
  const templateAxios = axios.create({
    baseURL: `${host}/template_manager/templates`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<Template[]> => templateAxios.get('/fetch').then(res => res.data),
    fetchTemplate: async (_id: string): Promise<Template | null> => templateAxios.post('/fetchTemplate', { _id }).then(res => res.data),
    create: async (template: Template): Promise<Template | null> =>
      templateAxios.post('/create', { template }).then(res => res.data.template),
    update: async (template: Partial<Template>) => templateAxios.put('/update', { template }),
    delete: async (_id: string) => templateAxios.post('/delete', { _id }),
    //TODO not sure about this one
    sheetUpdate: async (id: string, sheetData: Template["templateData"]) => templateAxios.put('/sheetUpdate', { id, sheetData }),
    updateTemplateWorkflowProcess: async (_id: string, workflowProcessId: Template["workflowProcessId"]) =>
      templateAxios.put('/workflowProcess', { _id, workflowProcessId }),
  };
})();

export default templateController;
