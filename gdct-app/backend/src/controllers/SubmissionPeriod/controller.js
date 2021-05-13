import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionPeriodService from '../../services/SubmissionPeriod';

const SubmissionPeriodController = Service([SubmissionPeriodService], service => {
  const router = Router();
  return (() => {
    router.get('/submissionPeriods/fetch', (req, res, next) => {
      service
        .findSubmissionPeriod({})
        .then(submissionPeriods => res.json({ submissionPeriods }))
        .catch(next);
    });

    router.post('/submissionPeriods/create', (req, res, next) => {
      const { submissionPeriod } = req.body;
      
      service
        .createSubmissionPeriod(submissionPeriod)
        .then(submissionPeriod => res.json({ submissionPeriod }))
        .catch(next);
    });

    router.put('/submissionPeriods/update', (req, res, next) => {
      const { submissionPeriod } = req.body;
      // console.log(_id)
      service
        .updateSubmissionPeriod(submissionPeriod._id, submissionPeriod)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/submissionPeriods/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteSubmissionPeriod(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default SubmissionPeriodController;
