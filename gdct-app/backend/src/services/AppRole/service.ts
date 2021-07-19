import Container from 'typedi';
//@ts-ignore
import i18n from 'i18n';
import AppRoleRepository from '../../repositories/AppRole';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import APPError from '../../utils/AppError';
import AppRole from '../../types/approle';
// @Service()
export default class AppRoleService {
  private AppRoleRepository: AppRoleRepository;
  private AppSysRoleRepository: AppSysRoleRepository;

  constructor() {
    this.AppRoleRepository = Container.get(AppRoleRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppRole(AppRole: AppRole) {
    return this.AppRoleRepository.create(AppRole);
  }

  async deleteAppRole(id: string) {
    if (await this.isRefered(id)) {
      throw new APPError(i18n.__('AppRole.service.deleteAppSys.existed'));
    }
    return this.AppRoleRepository.delete(id);
  }

  async updateAppRole(id: string, AppRole: Partial<AppRole>) {
    return this.AppRoleRepository.update(id, AppRole);
  }

  async findAppRole(AppRole: Partial<AppRole>) {
    return this.AppRoleRepository.find(AppRole);
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
