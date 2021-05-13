import axios from 'axios';

import { host } from '../constants/domain';

const submissionController = (() => {
  const submissionAxios = axios.create({
    baseURL: `${host}/submission_manager/submissions`,
    withCredentials: true,
  });
  return {
    fetchAndCreate: async email =>
      submissionAxios.post(`/findSubmissions`, { email }).then(res => res.data.submissions),
    updateWorkbook: async (submission, submissionNote) =>
      submissionAxios.post('/uploadSubmission', { submission, submissionNote }).then(res => res.data.submission),
    update: async submission => 
      submissionAxios.put(`/updateSubmission`, { submission }),
    updateStatus: async (submission, submissionNote, role, nextProcessId, updatedBy) =>
      submissionAxios.put(`/updateSubmissionStatus`, {submission, submissionNote, role, nextProcessId, updatedBy}),
    fetchSubmission: async _id => 
      submissionAxios.post('/findSubmission', { _id }).then(res => res.data.submission),
    fetch: async query => 
      submissionAxios.get('').then(res => res.data.submissions),
    delete: async _id => 
      submissionAxios.post('/delete', { _id }),
  };
})();

export default submissionController;
