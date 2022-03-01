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

  async findAllPurgeLog() {
    return this.AuditLogRepository.findAllPurge();
  }

  async createAuditLog(AuditLogInfo: AuditLog) {
    return this.AuditLogRepository.create(AuditLogInfo);
  }

  async moveAuditLog(date: Date, user: String) {
    return this.AuditLogRepository.move(date, user);
  }

  async findLatest() {
    return this.AuditLogRepository.findLast();
  }

  async findArchiveLog(startDate: Date, endDate: Date) {
    return this.AuditLogRepository.findArchives(startDate, endDate);
  }
}
