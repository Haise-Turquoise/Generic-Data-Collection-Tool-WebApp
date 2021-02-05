import AuditLogEntity from '../../entities/AuditLog';
import BaseRepository from '../repository';
import AuditLogModel from '../../models/AuditLog';

export default class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLogModel);
  }

  async create(AuditLogInfo) {
    return AuditLogModel.create(AuditLogInfo).then(AuditLogInfo => new AuditLogEntity(AuditLogInfo.toObject()));
  }

  // async find(query) {
  //   return AuditLogModel.find(query).then(AuditLoges =>
  //     AuditLoges.map(AuditLog => new AuditLogEntity(AuditLog.toObject())),
  //   );
  // }

  async findAll() {
    return AuditLogModel.find();
  }
}
