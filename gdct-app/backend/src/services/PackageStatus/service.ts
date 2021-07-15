import Container from 'typedi';
import PackageStatusRepository from '../../repositories/PackageStatus'

export default class PackageStatusService {
  private packageStatusRepository: PackageStatusRepository;

  constructor() {
    this.packageStatusRepository = Container.get(PackageStatusRepository);
  }
  
  async findAll() {
    return this.packageStatusRepository.findAll()
  }
}
