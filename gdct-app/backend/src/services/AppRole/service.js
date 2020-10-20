import Container from 'typedi';
import i18n from 'i18n';
import AppRoleRepository from '../../repositories/AppRole';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import APPError from '../../utils/AppError';
// @Service()
export default class AppRoleService {
  constructor() {
    this.AppRoleRepository = Container.get(AppRoleRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppRole(AppRole) {
    return this.AppRoleRepository.create(AppRole);
  }

  async deleteAppRole(id) {
    if (await this.isRefered(id)) {
      // throw Error('existed appSysRole');
      throw new APPError(i18n.__('AppRole.service.deleteAppSys.existed'));
    }
    return this.AppRoleRepository.delete(id);
  }

  async updateAppRole(id, AppRole) {
    return this.AppRoleRepository.update(id, AppRole);
  }

  async findAppRole(AppRole) {
    return this.AppRoleRepository.find(AppRole);
  }

  async isRefered(id) {
    const appRole = await this.AppRoleRepository.findById(id);
    const appSysRole = await this.AppSysRoleRepository.find({ role: appRole.code });
    return appSysRole.length !== 0;
  }
}
