import Container from 'typedi';
import AuditLogRepository from '../../repositories/AuditLog';

// @Service()
export default class AuditLogService {
  constructor() {
    this.AuditLogRepository = Container.get(AuditLogRepository);
  }

  async createAuditLog(AuditLogInfo) {
    return this.AuditLogRepository.create(AuditLogInfo);
  }

  // async findAuditLog(AuditLog) {
  //   return this.AuditLogRepository.find(AuditLog);
  // }

  async findAllAuditLog() {
    return this.AuditLogRepository.findAll();
  }
}
