import BaseRepository from '../repository';
import AuditLogModel from '../../models/AuditLog';
import { AuditLogDoc } from '../../types/auditlog';

export default class AuditLogRepository extends BaseRepository<AuditLogDoc> {
  constructor() {
    super(AuditLogModel);
  }

  async findAll() {
    return AuditLogModel.find();
  }

  async create(AuditLogInfo: AuditLogDoc) {
    return AuditLogModel.create(AuditLogInfo);
  }
}
