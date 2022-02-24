import { Service } from 'typedi';
import { Router } from 'express';
import AuditLogService from '../../services/AuditLog';

const AuditLogController = Service([AuditLogService], service => {
  const router = Router();

  return (function () {
    // Get All Audit Logs
    router.get('/fetchAllAuditLogs', (req, res, next) => {
      service
        .findAllAuditLog()
        .then(auditlogs => res.json(auditlogs))
        .catch(next)
    })

    //Get All Purge Logs
    router.get('/fetchAllPurgeLogs', (req, res, next) => {
      service
        .findAllPurgeLog()
        .then(auditlogs => res.json(auditlogs))
        .catch(next)
    })
    
    // Create one Audit Log
    router.post('/createAuditLog', (req, res, next) => {
      const { AuditLogInfo } = req.body;

      service
        .createAuditLog(AuditLogInfo)
        .then(auditlog => res.json(auditlog))
        .catch(next)
    });

    //purge from AuditLog and archive to PurgeLog
    router.put('/moveAuditLog', (req, res, next) => {
     // var date = new Date(req.query.date!.toString())
      const {date , user} = req.body
      service
        .moveAuditLog(date, user)
        .then(auditlogs => res.json(auditlogs))
        .catch(next)
    })

    // Get Latest purge log
    router.get('/fetchLatest', (req, res, next) => {
      service
        .findLatest()
        .then(purgelog => res.json(purgelog))
        .catch(next)
    })

    // fetch from archive logs given two dates, from between two dates
    router.post('/fetchFromArchiveLogs', (req: any, res, next) => {

      const {startDate, endDate} = req.body;
      // const startDate = req.params.startDate
      // const endDate = req.params.endDate

      service
        .findArchiveLog(startDate, endDate)
        .then(auditlogs => res.json(auditlogs))
        .catch(next)
    })

    return router;
  })();
});
  
export default AuditLogController;
