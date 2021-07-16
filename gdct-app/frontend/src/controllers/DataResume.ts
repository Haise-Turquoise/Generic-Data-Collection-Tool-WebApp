import axios from 'axios';
import DataResume from '../types/dataresume';
import { host } from '../constants/domain';

const dataResumeController = (() => {
  const dataResumeAxios = axios.create({
    baseURL: `${host}/dataResume`,
    withCredentials: true,
  });
  return {
    fetch: async (): Promise<DataResume[]> => dataResumeAxios.get('/fetch').then(res => res.data.dataResume),
    create: async (dataResume: DataResume): Promise<DataResume> =>
      dataResumeAxios.post('/create', { dataResume }).then(res => res.data.dataResume),
    update: async (dataResume: Partial<DataResume>) => dataResumeAxios.put('/update', { dataResume }),
    delete: async (_id: string) => dataResumeAxios.post('/delete', { _id }),
  };
})();

export default dataResumeController;
