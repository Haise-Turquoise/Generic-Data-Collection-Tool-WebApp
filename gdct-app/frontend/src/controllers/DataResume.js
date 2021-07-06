import axios from 'axios';

import { host } from '../constants/domain';

const dataResumeController = (() => {
  const dataResumeAxios = axios.create({
    baseURL: `${host}/dataResume`,
    withCredentials: true,
  });
  return {
    fetch: async _ => dataResumeAxios.get('/fetch').then(res => res.data.dataResume),
    create: async dataResume =>
      dataResumeAxios.post('/create', { dataResume }).then(res => res.data.dataResume),
    update: async dataResume => dataResumeAxios.put('/update', { dataResume }),
    delete: async _id => dataResumeAxios.post('/delete', { _id }),
  };
})();

export default dataResumeController;
