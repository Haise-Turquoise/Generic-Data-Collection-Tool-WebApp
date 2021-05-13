import AppRoleResouceEntity from '../../entities/AppRoleResource';
import BaseRepository from '../repository';
import AppRoleResourceModel from '../../models/AppRoleResource';
import AppRoleModel from '../../models/AppRole';
import AppSysRoleModel from '../../models/AppSysRole'
export default class AppRoleResourceRepository extends BaseRepository {
  constructor() {
    super(AppRoleResourceModel);
  }

  async delete(id) {
    // const appRoleResource = await AppRoleResourceModel.findById(id);
    // if (appRoleResource) {
    //   appRoleResource.isActive = false;
    // }
    // return this.update(id, appRoleResource);
    // return COAModel.findByIdAndDelete(id).then(COA => new COAEntity(COA.toObject()));
    return AppRoleResourceModel.findByIdAndDelete(id).then(appRoleResource=> new AppRoleResouceEntity(appRoleResource.toObject()))
  }

  async create(appRoleResource) {
    appRoleResource.isActive = true;
    const mongoose = require('mongoose');
    appRoleResource.appSysRoleId.roleId = mongoose.Types.ObjectId(appRoleResource.appSysRoleId.roleId);
    return AppRoleResourceModel.create(appRoleResource).then(
      
      appRoleResource => new AppRoleResouceEntity(appRoleResource.toObject()),
    );
  }

  async update(id, appRoleResource) {
    const mongoose = require('mongoose');
    appRoleResource.appSysRoleId.roleId = mongoose.Types.ObjectId(appRoleResource.appSysRoleId.roleId);
    appRoleResource.resourceId.forEach(resource=>{
      resource.id = mongoose.Types.ObjectId(resource.id);
    })

    return AppRoleResourceModel.findByIdAndUpdate(id, appRoleResource).then(
      appRoleResource => new AppRoleResouceEntity(appRoleResource.toObject()),
    );
  }

  async find(query) {
    return AppRoleResourceModel.find(query).then(appRoleResources => {
      return appRoleResources.map(
        appRoleResource => new AppRoleResouceEntity(appRoleResource.toObject()),
      );
    });
  }

  async findById(_id) {
    return AppRoleResourceModel.findById(_id).then(appRoleResource => {
      return new AppRoleResouceEntity(appRoleResource.toObject());
    });
  }

  async findByAppSysRoleId(RoleId) {
    return AppRoleResourceModel.findOne({ 'appSysRoleId.roleId': RoleId }).then(appRoleResource => {
      return new AppRoleResouceEntity(appRoleResource.toObject());
    });
  }
}
