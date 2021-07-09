import Container from 'typedi';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import { AppSysRoleDoc } from '../../types/appsysrole';

// @Service()
export default class AppSysRoleService {
  private AppSysRoleRepository: AppSysRoleRepository;

  constructor() {
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
  }

  async createAppSysRole(AppSysRole: AppSysRoleDoc) {
    return this.AppSysRoleRepository.create(AppSysRole);
  }

  async deleteAppSysRole(id: string) {
    return this.AppSysRoleRepository.delete(id);
  }

  async updateAppSysRole(id: string, AppSysRole: AppSysRoleDoc) {
    return this.AppSysRoleRepository.update(id, AppSysRole);
  }

  async findAppSysRole(AppSysRole: AppSysRoleDoc) {
    return this.AppSysRoleRepository.find(AppSysRole.toObject());
  }

  async findById(id: string) {
    return this.AppSysRoleRepository.findById(id);
  }
}
