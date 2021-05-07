import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionPeriodService from '../../services/SubmissionPeriod';

const SubmissionPeriodController = Service([SubmissionPeriodService], service => {
  const router = Router();
  return (() => {
    router.get('/submissionPeriods', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findSubmissionPeriod({})
        .then(submissionPeriods => res.json({ submissionPeriods }))
        .catch(next);
    });

    router.post('/submissionPeriods', (req, res, next) => {
      // console.log("test", req.body.submissionPeriod)
      service
        .createSubmissionPeriod(req.body.submissionPeriod)
        .then(submissionPeriod => res.json({ submissionPeriod }))
        .catch(next);
    });

    router.put('/submissionPeriods/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { submissionPeriod } = req.body;
      // console.log(_id)
      service
        .updateSubmissionPeriod(_id, submissionPeriod)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/submissionPeriods/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteSubmissionPeriod(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default SubmissionPeriodController;
