import BaseRepository from '../repository';
import PackageStatus, { PackageStatusDoc } from '../../types/packagestatus';
import PackageStatusModel from '../../models/PackageStatus';

export default class PackageStatusRepository extends BaseRepository<PackageStatus, PackageStatusDoc> {
  constructor() {
    super(PackageStatusModel);
  }
}
