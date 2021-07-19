import axios from 'axios';
import Submission from '../types/submission';
import SubmissionPeriod from '../types/submissionperiod';
import SubmissionNote from '../types/submissionnote';
import { host } from '../constants/domain';

const submissionController = (() => {
  const submissionAxios = axios.create({
    baseURL: `${host}/submission_manager/submissions`,
    withCredentials: true,
  });
  return {
    fetchAndCreate: async (email: string): Promise<Submission[]> =>
      submissionAxios.post(`/findSubmissions`, { email }).then(res => res.data.submissions),
    updateWorkbook: async (submission: Submission, submissionNote: SubmissionNote): Promise<Submission> =>
      submissionAxios
        .post('/uploadSubmission', { submission, submissionNote })
        .then(res => res.data.submission),
    update: async (submission: Partial<Submission>) => submissionAxios.put(`/updateSubmission`, { submission }),
    updateStatus: async (
      submission: Submission,
      submissionNote: SubmissionNote,
      role: string | undefined,
      nextProcessId: string,
      updatedBy: string,
    ): Promise<Submission> =>
      submissionAxios.put(`/updateSubmissionStatus`, {submission, submissionNote, role, nextProcessId, updatedBy}).then(res=>res.data.updatedSubmission),
    fetchSubmission: async (_id: string): Promise<Submission> => 
      submissionAxios.post('/findSubmission', { _id }).then(res => res.data.submission),
    fetchSubmissionReportingPeriod: async (_id: string): Promise<SubmissionPeriod> =>
      submissionAxios.post('/findReportingPeriod', { _id }).then(res => res.data.reportingPeriod),
    fetchSubmissionByParentId: async (parentId: string): Promise<Submission[]> =>
      submissionAxios
        .post('/findSubmissionByParentId', { parentId })
        .then(res => res.data.submission),
    fetch: async (query: Partial<Submission>): Promise<Submission[]> => submissionAxios.post('/findQuery', { query }).then(res => res.data.submissions),
    delete: async (_id: string) => submissionAxios.post('/delete', { _id }),
  };
})();

export default submissionController;
