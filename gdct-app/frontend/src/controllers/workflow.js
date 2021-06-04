import axios from 'axios';

import { host } from '../constants/domain';

const workflowController = (() => {
  const workflowAxios = axios.create({
    baseURL: `${host}/workflow_manager/workflows`,
    withCredentials: true,
  });
  return {
    fetch: async () => workflowAxios.get('/fetch').then(res => res.data),
    create: async workflowData => workflowAxios.post('/create', { workflowData }).then(res => res.data.workflow),
    update: async workflowData => workflowAxios.put('/update', { workflowData }),
    delete: async _id => workflowAxios.post('/delete', { _id }),
    fetchById: async _id => workflowAxios.post('/fetchById', { _id }).then(res => res.data.data),
    fetchByStatusId: async id => workflowAxios.post('/fetchByStatusId', { id }).then(res => res.data),
    fetchOnlyWorkflowById: async _id => workflowAxios.post('/fetchOnlyWorkflowById', { _id }).then(res => res.data),
    fetchProcess: async processId => workflowAxios.post('/fetchProcess', { processId }).then(res => res.data.data),
    fetchProcesses: async () => workflowAxios.get('/workflowProcesses/fetchWorkflowProcesses').then(res => res.data.data),
  };
})();

export default workflowController;
