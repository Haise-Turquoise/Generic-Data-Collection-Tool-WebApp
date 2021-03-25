import axios from 'axios';

import { host } from '../constants/domain';
const dataResumeController = (() => {
    const dataResumeAxios = axios.create({
      baseURL: `${host}/dataResume`,
      withCredentials: true,
    });
    return {
      fetch: async query => dataResumeAxios.get('').then(res => res.data.dataResume),
      create: async dataResume =>
      dataResumeAxios.post('', { dataResume }).then(res => res.data.dataResume),
      delete: async _id => dataResumeAxios.delete(`/${_id}`),
      update: async dataResume => dataResumeAxios.put(``, { dataResume }),
    //   addDocument: async dataResume =>
    //     masterValueAxios.post('/addDocument', { masterValue }).then(res => res.data.masterValue),
    };
  })();
  
export default dataResumeController;