import axios from 'axios';
import Submission, { SubmissionPopulated } from '../types/submission';
import SubmissionPeriod from '../types/submissionperiod';
import SubmissionNote from '../types/submissionnote';
import { host } from '../constants/domain';

interface role {
  role: string,
  orgId: string,
  progId: string,
  tempTypeId: string,
}

const submissionController = (() => {
  const submissionAxios = axios.create({
    baseURL: `${host}/submission_manager/submissions`,
    withCredentials: true,
  });
  return {
    fetchAndCreate: async (email: string): Promise<Submission[]> =>
      submissionAxios.post(`/findSubmissions`, { email }).then(res => res.data.submissions),
      updateWorkbook: async (submission: Submission, submissionNote: SubmissionNote|null): Promise<Submission | null> =>
      submissionAxios
      .post('/uploadSubmission', { submission, submissionNote })
      // TODO maybe should be .submissions
        .then(res => res.data.submission),
    create: async (submissions: Submission[]): Promise<Submission[]> =>
      submissionAxios.post('/createSubmissions', { submissions }).then(res => res.data.submissions),
    update: async (submission: Partial<Submission>) => submissionAxios.put(`/updateSubmission`, { submission }),
    updateStatus: async (
      submission: Submission,
      submissionNote: SubmissionNote,
      role: string | undefined,
      nextProcessId: string,
      updatedBy: string,
    ): Promise<Submission | null> =>
      submissionAxios.put(`/updateSubmissionStatus`, {submission, submissionNote, role, nextProcessId, updatedBy}).then(res=>res.data.updatedSubmission),
    fetchSubmission: async (_id: string): Promise<Submission | null> => 
      submissionAxios.post('/findSubmission', { _id }).then(res => res.data.submission),
    fetchSubmissionReportingPeriod: async (_id: string): Promise<SubmissionPeriod | null> =>
      submissionAxios.post('/findReportingPeriod', { _id }).then(res => res.data.reportingPeriod),
    fetchSubmissionByParentId: async (parentId: string): Promise<Submission[]> =>
      submissionAxios
        .post('/findSubmissionByParentId', { parentId })
        .then(res => res.data.submission),
    fetch: async (query: Partial<Submission>): Promise<Submission[]> => submissionAxios.post('/findQuery', { query }).then(res => res.data.submissions),
    fetchNamesOfIds: async (programId: string, submissionPeriodId: string ): Promise<any> => submissionAxios.post('/fetchNamesOfIds',{programId, submissionPeriodId}).then(res => res),
    delete: async (_id: string) => submissionAxios.post('/delete', { _id }),
    fetchByRole: async (roles: role[]): Promise<SubmissionPopulated[]> => submissionAxios.post('/findByRole', { roles }).then(res => res.data.submissions),
  };
})();

export default submissionController;
