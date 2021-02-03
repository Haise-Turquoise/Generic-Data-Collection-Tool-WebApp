import AuditLogEntity from '../../entities/AuditLog';
import BaseRepository from '../repository';
import AuditLogModel from '../../models/AuditLog';

export default class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLogModel);
  }

  async create(AuditLog) {
    AuditLog.isActive = true;
    return AuditLogModel.create(AuditLog).then(AuditLog => new AuditLogEntity(AuditLog.toObject()));
  }

  async find(query) {
    return AuditLogModel.find(query).then(AuditLoges =>
      AuditLoges.map(AuditLog => new AuditLogEntity(AuditLog.toObject())),
    );
  }

  async findAll() {
    return AuditLogModel.find();
  }
}
