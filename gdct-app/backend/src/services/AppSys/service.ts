//@ts-ignore
import i18n from 'i18n';
import Container from 'typedi';
import AppSysRepository from '../../repositories/AppSys';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import AppSys from '../../types/appsys';
import AppError from '../../utils/AppError';

// @Service()
export default class AppSysService {
  private AppSysRepository: AppSysRepository;
  private AppSysRoleRepository: AppSysRoleRepository;

  constructor() {
    this.AppSysRepository = Container.get(AppSysRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppSys(AppSys: AppSys) {
    return this.AppSysRepository.create(AppSys);
  }

  async deleteAppSys(id: string) {
    if (await this.isRefered(id)) {
      throw new AppError(i18n.__('AppSys.service.deleteAppSys.existed'), 409);
    }
    return this.AppSysRepository.delete(id);
  }

  async updateAppSys(id: string, AppSys: Partial<AppSys>) {
    return this.AppSysRepository.update(id, AppSys);
  }

  async findAppSys(id: string) {
    return this.AppSysRepository.findById(id);
  }

  async findAllAppSys() {
    return this.AppSysRepository.findAll();
  }

  async isRefered(id: string) {
    const appSys = await this.AppSysRepository.findById(id);
    const appSysRole = await this.AppSysRoleRepository.find({ appSys: appSys.code });
    return appSysRole.length !== 0;
  }
}
