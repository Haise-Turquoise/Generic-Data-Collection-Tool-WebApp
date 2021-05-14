import BaseRepository from '../repository';
import AuditLogModel from '../../models/AuditLog';

export default class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLogModel);
  }

  async findAll() {
    return AuditLogModel.find();
  }

  async create(AuditLogInfo) {
    // @ts-ignore
    return AuditLogModel.create(AuditLogInfo);
  }
}
