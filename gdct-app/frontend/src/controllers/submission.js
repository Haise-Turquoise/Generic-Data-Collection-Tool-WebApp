import axios from 'axios';

import { host } from '../constants/domain';

const submissionController = (() => {
  const submissionAxios = axios.create({
    baseURL: `${host}/submission_manager/submissions`,
    withCredentials: true,
  });
  return {
    fetchAndCreate: async email =>
      submissionAxios.post(`/findSubmissions`, { email }).then(res => {
        return res.data.submissions;
      }),
    updateWorkbook: async (submission, submissionNote) =>
      submissionAxios
        .post('/uploadSubmission', { submission, submissionNote })
        .then(res => res.data.submission),
    update: async submission => submissionAxios.put(`/updateSubmission`, { submission }),
    updateStatus: async (submission, submissionNote, role, nextProcessId, updatedBy) =>
      submissionAxios.put(`/updateSubmissionStatus`, {
        submission,
        submissionNote,
        role,
        nextProcessId,
        updatedBy,
      }),
    fetchSubmission: async _id =>
      submissionAxios.get(`/findSubmission/${_id}`).then(res => res.data.submission),

    fetchSubmissionReportingPeriod: async _id =>
      submissionAxios.get(`/findReportingPeriod/${_id}`).then(res => res.data.reportingPeriod),

    fetch: async query => submissionAxios.get('').then(res => res.data.submissions),

    delete: async _id => submissionAxios.delete(`/${_id}`),
    openTemplate: async _id => submissionAxios.get(`/openTemplate/${_id}`).then(res => res.data.spreadsheetId),
  };
})();

export default submissionController;
