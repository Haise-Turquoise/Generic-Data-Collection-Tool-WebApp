import AppRoleResouceEntity from '../../entities/AppRoleResource';
import BaseRepository from '../repository';
import AppRoleResourceModel from '../../models/AppRoleResource';
import { AppRoleResourceDoc } from '../../types/approleresource';
import { FilterQuery } from 'mongoose';
export default class AppRoleResourceRepository extends BaseRepository<AppRoleResourceDoc> {
  constructor() {
    super(AppRoleResourceModel);
  }

  async delete(id: string) {
    // const appRoleResource = await AppRoleResourceModel.findById(id);
    // if (appRoleResource) {
    //   appRoleResource.isActive = false;
    // }
    // return this.update(id, appRoleResource);
    // return COAModel.findByIdAndDelete(id).then(COA => new COAEntity(COA.toObject()));
    return AppRoleResourceModel.findByIdAndDelete(id).then((appRoleResource: AppRoleResourceDoc)=> new AppRoleResouceEntity(appRoleResource))
  }

  async create(appRoleResource: AppRoleResourceDoc) {
    const mongoose = require('mongoose');
    appRoleResource.appSysRoleId.roleId = mongoose.Types.ObjectId(appRoleResource.appSysRoleId.roleId);
    return AppRoleResourceModel.create(appRoleResource).then(
      
      appRoleResource => new AppRoleResouceEntity(appRoleResource),
    );
  }

  async update(id: string, appRoleResource: AppRoleResourceDoc) {
    const mongoose = require('mongoose');
    appRoleResource.appSysRoleId.roleId = mongoose.Types.ObjectId(appRoleResource.appSysRoleId.roleId);
    appRoleResource.resourceId.forEach(resource=>{
      resource.id = mongoose.Types.ObjectId(resource.id);
    })

    return AppRoleResourceModel.findByIdAndUpdate(id, appRoleResource).then(
      (appRoleResource: AppRoleResourceDoc) => new AppRoleResouceEntity(appRoleResource),
    );
  }

  async find(query: FilterQuery<AppRoleResourceDoc>) {
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

  async findByAppSysRoleId(RoleId: string) {
    return AppRoleResourceModel.findOne({ 'appSysRoleId.roleId': RoleId }).then((appRoleResource: AppRoleResourceDoc) => {
      return new AppRoleResouceEntity(appRoleResource);
    });
  }
}
