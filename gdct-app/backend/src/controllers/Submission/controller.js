import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionService from '../../services/Submission';

const SubmissionController = Service([SubmissionService], service => {
  const router = Router();
  return (() => {
    router.get('/submissions', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findSubmission({})
        .then(submissions => res.json({ submissions }))
        .catch(next);
    });

    router.get('/submissions/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .findSubmissionById(_id)
        .then(submission => res.json({ submission }))
        .catch(next);
    });

    router.post('/submissions', (req, res, next) => {
      service
        .createSubmission(req.body.submission)
        .then(submission => res.json({ submission }))
        .catch(next);
    });

    router.put('/submissions/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { submission } = req.body;

      service
        .updateSubmission(_id, submission)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/submissions/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteSubmission(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default SubmissionController;
