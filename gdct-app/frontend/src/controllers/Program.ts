import axios from 'axios';
import Program from '../types/program';
import { host } from '../constants/domain';

const programController = (() => {
  const programAxios = axios.create({
    baseURL: `${host}/programs`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<Program[]> => programAxios.get('/fetch').then(res => res.data),
    create: async (program: Program): Promise<Program> =>
      programAxios.post('/create', { program }).then(res => res.data.program),
    update: async (program: Partial<Program>) => programAxios.put('/update', { program }),
    delete: async (_id: string) => programAxios.post('/delete', { _id }),
    fetchByIds: async (ids: string[]): Promise<Program[]> =>
      programAxios.post(`/searchPrograms`, { ids }).then(res => res.data.programs),
    fetchById: async (_id: string): Promise<Program> =>
      programAxios.post('/searchProgram', { _id }).then(res => res.data.program),
  };
})();

export default programController;
