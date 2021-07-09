import BaseRepository from '../repository';
import AuditLogModel from '../../models/AuditLog';
import AuditLog, { AuditLogDoc } from '../../types/auditlog';

export default class AuditLogRepository extends BaseRepository<AuditLog, AuditLogDoc> {
  constructor() {
    super(AuditLogModel);
  }

  async findAll() {
    return AuditLogModel.find();
  }

  async create(AuditLogInfo: AuditLog) {
    return AuditLogModel.create(AuditLogInfo);
  }
}
