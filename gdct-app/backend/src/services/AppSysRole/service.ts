import Container from 'typedi';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import AppSysRole from '../../types/appsysrole';

// @Service()
export default class AppSysRoleService {
  private AppSysRoleRepository: AppSysRoleRepository;

  constructor() {
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppSysRole(AppSysRole: AppSysRole) {
    return this.AppSysRoleRepository.create(AppSysRole);
  }

  async deleteAppSysRole(id: string) {
    return this.AppSysRoleRepository.delete(id);
  }

  async updateAppSysRole(id: string, AppSysRole: Partial<AppSysRole>) {
    return this.AppSysRoleRepository.update(id, AppSysRole);
  }

  async findAppSysRole(AppSysRole: Partial<AppSysRole>) {
    return this.AppSysRoleRepository.find(AppSysRole);
  }

  async findById(id: string) {
    return this.AppSysRoleRepository.findById(id);
  }
}
