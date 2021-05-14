import Container from 'typedi';
import AuditLogRepository from '../../repositories/AuditLog';

// @Service()
export default class AuditLogService {
  constructor() {
    this.AuditLogRepository = Container.get(AuditLogRepository);
  }

  async findAllAuditLog() {
    return this.AuditLogRepository.findAll();
  }

  async createAuditLog(AuditLogInfo) {
    return this.AuditLogRepository.create(AuditLogInfo);
  }
}
