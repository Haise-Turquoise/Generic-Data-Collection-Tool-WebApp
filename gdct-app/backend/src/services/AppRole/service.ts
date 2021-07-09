import Container from 'typedi';
import i18n from 'i18n';
import AppRoleRepository from '../../repositories/AppRole';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import APPError from '../../utils/AppError';
import { AppRoleDoc } from '../../types/approle';
// @Service()
export default class AppRoleService {
  private AppRoleRepository: AppRoleRepository;
  private AppSysRoleRepository: AppSysRoleRepository;

  constructor() {
    this.AppRoleRepository = Container.get(AppRoleRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppRole(AppRole: AppRoleDoc) {
    return this.AppRoleRepository.create(AppRole);
  }

  async deleteAppRole(id: string) {
    if (await this.isRefered(id)) {
      throw new APPError(i18n.__('AppRole.service.deleteAppSys.existed'));
    }
    return this.AppRoleRepository.delete(id);
  }

  async updateAppRole(id: string, AppRole: AppRoleDoc) {
    return this.AppRoleRepository.update(id, AppRole);
  }

  async findAppRole(AppRole: AppRoleDoc) {
    return this.AppRoleRepository.find(AppRole.toObject());
  }

  async isRefered(id: string) {
    const appRole = await this.AppRoleRepository.findById(id);
    const appSysRole = await this.AppSysRoleRepository.find({ role: appRole.code });
    return appSysRole.length !== 0;
  }

  async findById(id: string) {
    return this.AppRoleRepository.findById(id);
  }
}
