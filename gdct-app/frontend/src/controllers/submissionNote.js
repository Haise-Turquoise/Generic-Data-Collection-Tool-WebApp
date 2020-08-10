import axios from 'axios';

import { host } from '../constants/domain';

const submissionNoteController = (() => {
  const submissionNoteAxios = axios.create({
    baseURL: `${host}/submissionNote_manager/submissionNote`,
    withCredentials: true,
  });
  return {
    fetchBySubmissionId: async submissionId =>
      submissionNoteAxios
        .post(`/findSubmissionNoteBySubmissionId`, { submissionId })
        .then(res => res.data.submissionNote),
    create: async submissionNote =>
      submissionNoteAxios
        .post(`/createSubmissionNote`, { submissionNote })
        .then(res => res.data.submissionNote),
  };
})();

export default submissionNoteController;
