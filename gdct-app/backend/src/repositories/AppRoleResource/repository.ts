import AppRoleResouceEntity from '../../entities/AppRoleResource';
import BaseRepository from '../repository';
import AppRoleResourceModel from '../../models/AppRoleResource';
import AppRoleResource, { AppRoleResourceDoc } from '../../types/approleresource';
import { ObjectId } from 'mongodb'
import AppError from '../../utils/AppError';
export default class AppRoleResourceRepository extends BaseRepository<AppRoleResource, AppRoleResourceDoc> {
  constructor() {
    super(AppRoleResourceModel);
  }

  async delete(id: string) {
    const result = await AppRoleResourceModel.findByIdAndDelete(id);
    if (!result) throw new AppError(`Cannot delete app role resource: ID ${id} does not exist`);
    return new AppRoleResouceEntity(result);
  }

  async create(appRoleResource: AppRoleResource) {
    const mongoose = require('mongoose');
    appRoleResource.appSysRoleId.roleId = mongoose.Types.ObjectId(appRoleResource.appSysRoleId.roleId);
    return AppRoleResourceModel.create(appRoleResource).then(
      
      appRoleResource => new AppRoleResouceEntity(appRoleResource),
    );
  }

  async update(id: string, appRoleResource: Partial<AppRoleResource>) {
    const mongoose = require('mongoose');
    if (appRoleResource.appSysRoleId) {
      appRoleResource.appSysRoleId.roleId = new ObjectId(appRoleResource.appSysRoleId.roleId);
    }
    appRoleResource.resourceId?.forEach(resource=>{
      resource.id = mongoose.Types.ObjectId(resource.id);
    })

    return AppRoleResourceModel.findByIdAndUpdate(id, appRoleResource).then(
      (appRoleResource: AppRoleResourceDoc) => new AppRoleResouceEntity(appRoleResource),
    );
  }

  async find(query: Partial<AppRoleResource>) {
    return AppRoleResourceModel.find(query).then((appRoleResources: AppRoleResourceDoc[]) => {
      return appRoleResources.map(
        appRoleResource => new AppRoleResouceEntity(appRoleResource),
      );
    });
  }

  async findById(_id: string) {
    return AppRoleResourceModel.findById(_id).then((appRoleResource: AppRoleResourceDoc) => {
      return new AppRoleResouceEntity(appRoleResource);
    });
  }

  async findByAppSysRoleId(RoleId: string | ObjectId) {
    return AppRoleResourceModel.findOne({ 'appSysRoleId.roleId': RoleId }).then((appRoleResource: AppRoleResourceDoc) => {
      return new AppRoleResouceEntity(appRoleResource);
    });
  }
}
