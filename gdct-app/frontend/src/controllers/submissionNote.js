import axios from 'axios';

const submissionNoteController = (() => {
  const submissionNoteAxios = axios.create({
    baseURL: 'http://localhost:3000/submissionNote_manager/submissionNote',
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
