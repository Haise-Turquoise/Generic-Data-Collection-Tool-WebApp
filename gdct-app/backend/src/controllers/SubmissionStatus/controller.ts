import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionStatusService from '../../services/SubmissionStatus'

const PackageStatusController = Service([SubmissionStatusService], service => {
  const router = Router();
  return (() => {
    router.get('/submissionStatus', (req, res, next) => {
      service
        .findAll()
        .then(submissionStatus => res.json( submissionStatus ))
        .catch(next);
    });

    router.get('/submissionState', (req, res, next) => {
      service
        .findEach()
        .then(submissionState => res.json( submissionState ))
        .catch(next);
    })

    return router;
  })();
});

export default PackageStatusController;
