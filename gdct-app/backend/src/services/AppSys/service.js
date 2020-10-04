import Container from 'typedi';
import AppSysRepository from '../../repositories/AppSys';
import AppSysRoleRepository from '../../repositories/AppSysRole';

// @Service()
export default class AppSysService {
  constructor() {
    this.AppSysRepository = Container.get(AppSysRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppSys(AppSys) {
    return this.AppSysRepository.create(AppSys);
  }

  async deleteAppSys(id) {
    if (await this.isRefered(id)) {
      throw Error('existed appSysRole');
    }
    return this.AppSysRepository.delete(id);
  }

  async updateAppSys(id, AppSys) {
    return this.AppSysRepository.update(id, AppSys);
  }

  async findAppSys(AppSys) {
    return this.AppSysRepository.find(AppSys);
  }

  async findAllAppSys() {
    return this.AppSysRepository.findAll();
  }

  async isRefered(id) {
    const appSys = await this.AppSysRepository.findById(id);
    const appSysRole = await this.AppSysRoleRepository.find({ appSys: appSys.code });
    return appSysRole.length !== 0;
  }
}
