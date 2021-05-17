import Container from 'typedi';
import AppRoleResourceRepository from '../../repositories/AppRoleResource';
import AppSysRoleRepository from '../../repositories/AppSysRole';
import AppRoleRepository from '../../repositories/AppRole'
// @Service()
export default class AppRoleResourceService {
  constructor() {
    this.AppRoleResourceRepository = Container.get(AppRoleResourceRepository);
    this.AppSysRoleRepository = Container.get(AppSysRoleRepository);
    this.AppRoleRepository = Container.get(AppRoleRepository)
  }

  async createAppRoleResource(appRoleResource) {
    let appSysRole = await this.AppSysRoleRepository.findById(appRoleResource.appSysRoleId)

    const roleId = appRoleResource.appSysRoleId;
    appRoleResource.appSysRoleId = {}
    appRoleResource.appSysRoleId.roleId = roleId;
    appRoleResource.appSysRoleId.roleName = appSysRole.appSys + " " + appSysRole.role;

    return this.AppRoleResourceRepository.create(appRoleResource);
  }

  async deleteAppRoleResource(id) {
    return this.AppRoleResourceRepository.delete(id);
  }

  async updateAppRoleResource(id, appRoleResource) {
    // update the resourceId
    if(appRoleResource.appSysRoleId.roleId){
      return this.AppRoleResourceRepository.update(id, appRoleResource);
    }
    // update the appSysRoleId
    else{
      // replace the ObjectId with the object contains more information
      let appSysRole = await this.AppSysRoleRepository.findById(appRoleResource.appSysRoleId)
      const roleId = appRoleResource.appSysRoleId;
      appRoleResource.appSysRoleId = {}
      appRoleResource.appSysRoleId.roleId = roleId;
      appRoleResource.appSysRoleId.roleName = appSysRole.appSys + " " + appSysRole.role;
      return this.AppRoleResourceRepository.update(id, appRoleResource);
    }
    
    
  }

  async findAppRoleResource(appRoleResource) {
    return this.AppRoleResourceRepository.find(appRoleResource);
  }

  async findById(id) {
    return this.AppRoleResourceRepository.findById(id);
  }
}
