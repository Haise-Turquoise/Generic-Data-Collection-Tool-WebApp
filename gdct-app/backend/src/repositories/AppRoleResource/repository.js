import AppRoleResouceEntity from '../../entities/AppRoleResource';
import BaseRepository from '../repository';
import AppRoleResourceModel from '../../models/AppRoleResource';

export default class AppRoleResourceRepository extends BaseRepository {
  constructor() {
    super(AppRoleResourceModel);
  }

  async delete(id) {
    const appRoleResource = await AppRoleResourceModel.findById(id);
    if (appRoleResource) {
      appRoleResource.isActive = false;
    }
    return this.update(id, appRoleResource);
  }

  async create(appRoleResource) {
    appRoleResource.isActive = true;
    return AppRoleResourceModel.create(appRoleResource).then(
      appRoleResource => new AppRoleResouceEntity(appRoleResource.toObject()),
    );
  }

  async update(id, appRoleResource) {
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

  async findByAppSysRoleId(appSysRoleId) {
    return AppRoleResourceModel.findOne({ appSysRoleId }).then(appRoleResource => {
      return new AppRoleResouceEntity(appRoleResource.toObject());
    });
  }
}
