import Container from 'typedi';
import AuditLogRepository from '../../repositories/AuditLog';

// @Service()
export default class AuditLogService {
  constructor() {
    this.AuditLogRepository = Container.get(AuditLogRepository);
  }

  async createAuditLog(AuditLog) {
    return this.AuditLogRepository.create(AuditLog);
  }

  async findAuditLog(AuditLog) {
    return this.AuditLogRepository.find(AuditLog);
  }

  async findAllAuditLog() {
    return this.AuditLogRepository.findAll();
  }
}
