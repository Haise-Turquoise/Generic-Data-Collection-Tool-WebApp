import axios from 'axios';

import { host } from '../constants/domain';

const workflowController = (() => {
  const workflowAxios = axios.create({
    baseURL: `${host}/workflow_manager/workflows`,
    withCredentials: true,
  });
  return {
    // fetchWorkflows: async (query) =>
    //   workflowAxios.get('').then((res) => res.data.workflows),
    create: async workflowData =>
      workflowAxios.post('', { data: workflowData }).then(res => res.data.workflow),
    delete: async _id => workflowAxios.delete(`/${_id}`),
    update: async workflowData =>
      workflowAxios.put(`/${workflowData.workflow._id}`, { data: workflowData }),
    fetch: async () => workflowAxios.get('').then(res => res.data.data),
    fetchById: async workflowId =>
      workflowAxios.get(`/${workflowId}`).then(res => {
        return res.data.data;
      }),
    fetchProcess: async processId =>
      workflowAxios.get(`/workflowProcessId/${processId}`).then(res => res.data.data),
    fetchProcesses: async () =>
      workflowAxios.get('/workflowProcesses/fetchWorkflowProcesses').then(res => res.data.data),
  };
})();

export default workflowController;
