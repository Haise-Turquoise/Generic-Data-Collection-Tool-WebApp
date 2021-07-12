import Container from 'typedi';
import AuditLogRepository from '../../repositories/AuditLog';
import AuditLog from '../../types/auditlog';

// @Service()
export default class AuditLogService {
  private AuditLogRepository: AuditLogRepository;

  constructor() {
    this.AuditLogRepository = Container.get(AuditLogRepository);
  }

  async findAllAuditLog() {
    return this.AuditLogRepository.findAll();
  }

  async createAuditLog(AuditLogInfo: AuditLog) {
    return this.AuditLogRepository.create(AuditLogInfo);
  }
}
