import { Service } from 'typedi';
import { Router } from 'express';
import SubmissionStatusService from '../../services/SubmissionStatus'

const PackageStatusController = Service([SubmissionStatusService], service => {
  const router = Router();
  return (() => {

    router.get('/submissionStatus/submissionStateCount', (req, res, next) => {
      console.log("ggg");
      service
        .findEach()
        .then(submissionState => res.json( submissionState ))
        .catch(next);
    })

    router.get('/submissionStatus', (req, res, next) => {
      service
        .findAll()
        .then(submissionStatus => res.json( submissionStatus ))
        .catch(next);
    });

    router.get('/submissionStatus/open', (req, res, next) => {
      service
        .find({ reportingPeriod: {submissionClosed: false} })
        .then(submissionStatus => res.json( submissionStatus ))
        .catch(next)
    })

    router.post('/submissionStatus/createByRoles', (req, res, next) => {
      const { roles, userId } = req.body
      service
        .createByRoles(roles, userId)
        .then(status => res.json(status))
        .catch(next);
    })

    router.get('/submissionStatus/submissionState', (req, res, next) => {

      service
        .find({ reportingPeriod: {submissionClosed: false} })
        .then(submissionStatus => res.json( submissionStatus ))
        .catch(next)
    })

    router.post('/submissionStatus/createByRoles', (req, res, next) => {
      const { roles, userId } = req.body
      service
        .createByRoles(roles, userId)
        .then(status => res.json(status))
        .catch(next);
    })

    router.get('/submissionStatus/open', (req, res, next) => {
      service
        .find({ reportingPeriod: {submissionClosed: false} })
        .then(submissionStatus => res.json( submissionStatus ))
        .catch(next)
    })

    router.post('/submissionStatus/createByRoles', (req, res, next) => {
      const { roles, userId } = req.body
      service
        .createByRoles(roles, userId)
        .then(status => res.json(status))
        .catch(next);
    })

    return router;
  })();
});

export default PackageStatusController;
