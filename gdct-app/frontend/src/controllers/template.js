import axios from 'axios';

import { host } from '../constants/domain';

const templateController = (() => {
  const templateAxios = axios.create({
    baseURL: `${host}/template_manager/templates`,
    withCredentials: true,
  });
  return {
    fetch: async _ => templateAxios.get('/fetch').then(res => res.data),
    fetchTemplate: async _id => templateAxios.post('/fetchTemplate', { _id }).then(res => res.data),
    create: async template => templateAxios.post('/create', { template }).then(res => res.data.template),
    update: async template => templateAxios.put('/update', { template }),
    delete: async _id => templateAxios.post('/delete', { _id }),
    sheetUpdate: async (id, sheetData) => templateAxios.put('/sheetUpdate', { id, sheetData }),
    updateTemplateWorkflowProcess: async (_id, workflowProcessId) => 
      templateAxios.put('/workflowProcess', { _id, workflowProcessId }),
  };
})();

export default templateController;
