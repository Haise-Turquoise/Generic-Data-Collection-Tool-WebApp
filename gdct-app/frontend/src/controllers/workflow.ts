import axios from 'axios';
import Workflow, { WorkflowData } from '../types/workflow';
import WorkflowProcess from '../types/workflowprocess';
import { host } from '../constants/domain';

const workflowController = (() => {
  const workflowAxios = axios.create({
    baseURL: `${host}/workflow_manager/workflows`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<Workflow[]> => workflowAxios.get('/fetch').then(res => res.data),
    create: async (workflowData: WorkflowData): Promise<Workflow | null> =>
      workflowAxios.post('/create', { workflowData }).then(res => res.data.workflow),
    update: async (workflowData: WorkflowData) => workflowAxios.put('/update', { workflowData }),
    delete: async (_id: string) => workflowAxios.post('/delete', { _id }),
    fetchById: async (_id: string): Promise<{workflow: Workflow, workflowProcesses: WorkflowProcess[]} | null> => workflowAxios.post('/fetchById', { _id }).then(res => res.data.data),
    fetchByStatusId: async (id: string): Promise<Workflow | null> =>
      workflowAxios.post('/fetchByStatusId', { id }).then(res => res.data),
    fetchOnlyWorkflowById: async (_id: string): Promise<Workflow | null> =>
      workflowAxios.post('/fetchOnlyWorkflowById', { _id }).then(res => res.data),
    fetchProcess: async (processId: string): Promise<WorkflowProcess | null> =>
      workflowAxios.post('/fetchProcess', { processId }).then(res => res.data.data),
    fetchProcesses: async (): Promise<WorkflowProcess[]> =>
      workflowAxios.get('/workflowProcesses/fetchWorkflowProcesses').then(res => res.data.data),
    fetchProcessesByWorkflowId: async (workflowId: string) =>
      workflowAxios
        .post('./fetchWorkflowProcessesByWorkflowId', { workflowId })
        .then(res => res.data.data),
    fetchProcessesByIds: async (ids: string[]): Promise<WorkflowProcess[]> =>
      workflowAxios.post('/fetchProcessByIds', { ids }).then(res => res.data.data),
    fetchProcessesByWorkflowIds: async (workflowIds: string[]) =>
      workflowAxios
        .post('/fetchWorkflowProcessesByWorkflowIds', { workflowIds })
        .then(res => res.data.data),
  };
})();

export default workflowController;
