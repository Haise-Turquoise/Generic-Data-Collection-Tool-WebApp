import { Service } from 'typedi';
import { Router } from 'express';
import ReportingPeriodService from '../../services/ReportingPeriod';

const ReportingPeriodController = Service([ReportingPeriodService], service => {
  const router = Router();
  return (() => {
    router.get('/reportingPeriods/fetch', (req, res, next) => {
      service
        .findReportingPeriod({})
        .then(reportingPeriods => res.json( reportingPeriods ))
        .catch(next);
    });

    router.post('/reportingPeriods/fetchReportingPeriod', (req, res, next) => {
      const { _id } = req.body;

      service
        .findReportingPeriodById(_id)
        .then(reportingPeriod => res.json({ reportingPeriod }))
        .catch(next);
    });

    router.post('/reportingPeriods/create', (req, res, next) => {
      service
        .createReportingPeriod(req.body.reportingPeriod)
        .then(reportingPeriod => res.json({ reportingPeriod }))
        .catch(next);
    });

    router.put('/reportingPeriods/update', (req, res, next) => {
      const { reportingPeriod } = req.body;
      const _id = reportingPeriod._id;

      service
        .updateReportingPeriod(_id, reportingPeriod)
        .then(() => res.end())
        .catch(next);
    });

    router.post('/reportingPeriods/fecthSpecificPeriods', (req,res,next) => {
      const {ids} = req.body;

      service
        .findSpecificPeriods(ids)
        .then(reportingPeriods => res.json({ reportingPeriods }))
        .catch(next)
    })

    router.post('/reportingPeriods/delete', (req, res, next) => {
      const { _id } = req.body;

      service
        .deleteReportingPeriod(_id)
        .then(() => res.end())
        .catch(next);
    });

    return router;
  })();
});

export default ReportingPeriodController;
