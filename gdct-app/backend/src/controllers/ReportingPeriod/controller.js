import { Service } from 'typedi';
import { Router } from 'express';
import ReportingPeriodService from '../../services/ReportingPeriod';

const ReportingPeriodController = Service([ReportingPeriodService], service => {
  const router = Router();
  return (() => {
    router.get('/reportingPeriods', (req, res, next) => {
      // Get query from middleware -- auth handler

      service
        .findReportingPeriod({})
        .then(reportingPeriods => res.json({ reportingPeriods }))
        .catch(next);
    });

    router.post('/reportingPeriods', (req, res, next) => {
      service
        .createReportingPeriod(req.body.reportingPeriod)
        .then(reportingPeriod => res.json({ reportingPeriod }))
        .catch(error => {
          throw error;
        })
        .catch(next);
    });

    router.put('/reportingPeriods/:_id', (req, res, next) => {
      const { _id } = req.params;
      const { reportingPeriod } = req.body;

      service
        .updateReportingPeriod(_id, reportingPeriod)
        .then(() => res.end())
        .catch(next);
    });

    router.delete('/reportingPeriods/:_id', (req, res, next) => {
      const { _id } = req.params;

      service
        .deleteReportingPeriod(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default ReportingPeriodController;
