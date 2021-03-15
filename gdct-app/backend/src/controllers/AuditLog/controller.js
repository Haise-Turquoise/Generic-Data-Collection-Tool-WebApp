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
    
    // Create one Audit Log
    router.post(`/createAuditLog`, (req, res, next) => {
      const { AuditLogInfo } = req.body;
      service
        .createAuditLog(AuditLogInfo)
        .catch(next)
    });

    return router;
  })();
});
  
export default AuditLogController;
