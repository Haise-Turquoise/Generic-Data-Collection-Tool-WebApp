import Container from 'typedi';
import AppRoleResourceRepository from '../../repositories/AppRoleResource';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import AppRoleRepository from '../../repositories/AppRole'
import AppRoleResource from '../../types/approleresource';
import { ObjectId } from 'mongodb';
// @Service()
export default class AppRoleResourceService {
  private AppRoleResourceRepository: AppRoleResourceRepository;
  private AppSysRoleRepository: AppSysRoleRepository;
  private AppRoleRepository: AppRoleRepository;

  constructor() {
    this.AppRoleResourceRepository = Container.get(AppRoleResourceRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
    this.AppRoleRepository = Container.get(AppRoleRepository)
  }

  async createAppRoleResource(appRoleResource: AppRoleResource) {
    let appSysRole = await this.AppSysRoleRepository.findById(
      typeof appRoleResource.appSysRoleId === 'string' ?  appRoleResource.appSysRoleId : appRoleResource.appSysRoleId.roleId
    )
    appRoleResource.appSysRoleId = { roleId: appSysRole._id, roleName: appSysRole.appSys + " " + appSysRole.role}

    return this.AppRoleResourceRepository.create(appRoleResource);
  }

  async deleteAppRoleResource(id: string) {
    return this.AppRoleResourceRepository.delete(id);
  }

  async updateAppRoleResource(id: string, appRoleResource: Partial<AppRoleResource>) {
    // update the resourceId
    console.log('id flag', id)
    if(typeof appRoleResource.appSysRoleId !== "string"){
      return this.AppRoleResourceRepository.update(id, appRoleResource);
    }
    // update the appSysRoleId
    else{
      // replace the ObjectId with the object contains more information
      let appSysRole = await this.AppSysRoleRepository.findById(appRoleResource.appSysRoleId || '')
      const roleId = appSysRole._id;
      appRoleResource.appSysRoleId = { roleId, roleName: appSysRole.appSys + " " + appSysRole.role }
      return this.AppRoleResourceRepository.update(id, appRoleResource);
    }
  }

  async findAppRoleResource(appRoleResource: Partial<AppRoleResource>) {
    return this.AppRoleResourceRepository.find(appRoleResource);
  }

  async findById(id: string) {
    return this.AppRoleResourceRepository.findById(id);
  }
}
