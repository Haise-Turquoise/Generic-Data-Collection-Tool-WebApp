import { Service } from 'typedi';
import { Router } from 'express';
import AuditLogService from '../../services/AuditLog';
import AuditLogEntity from '../../entities/AuditLog';
import { authorized } from '../../middlewares/auth/auth';

const AuditLogController = Service([AuditLogService], service => {
    const router = Router();
  
    return (function () {
        router.post(`/AuditLog/createAuditLog`, (req, res, next) => {
            const { auditInfo } = req.body;
            service.createAuditLog(auditInfo).catch(next)
        });

        router.get('/AuditLog/fetchAllAuditLogs', (req, res, next) => {
            service
                .findAllAuditLog()
                .then(auditlogs => res.json({ auditlogs }))
                .catch(next)
        })

        return router;
    })();
});
  
export default AuditLogController;
