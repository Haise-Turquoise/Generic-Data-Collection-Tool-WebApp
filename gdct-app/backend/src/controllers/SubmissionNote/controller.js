import { Service } from 'typedi';

import { Router } from 'express';
import SubmissionNoteService from '../../services/SubmissionNote';

const SubmissionNoteController = Service([SubmissionNoteService], service => {
  const router = Router();
  return (() => {
    router.post('/submissionNote/findSubmissionNoteBySubmissionId', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { submissionId } = req.body;
      service
        .findSubmissionNoteById(submissionId)
        .then(submissionNote => {
          res.json({ submissionNote });
        })
        .catch(next);
    });

    router.put('/submissionNote/createSubmissionNote', (req, res, next) => {
      // Get query from middleware -- auth handler
      const { submissionNote } = req.body;
      service
        .createSubmissionNote(submissionNote)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default SubmissionNoteController;
