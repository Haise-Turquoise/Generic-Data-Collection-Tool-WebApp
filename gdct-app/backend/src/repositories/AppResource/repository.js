import AppResouceEntity from '../../entities/AppResource';
import BaseRepository from '../repository';
import AppResourceModel from '../../models/AppResource';

export default class AppResourceRepository extends BaseRepository {
  constructor() {
    super(AppResourceModel);
  }

  async delete(id) {
    const appResource = await AppResourceModel.findById(id);
    if (appResource) {
      appResource.isActive = false;
    }
    return this.update(id, appResource);
  }

  async create(appResource) {
    appResource.isActive = true;
    return AppResourceModel.create(appResource);
  }

  async update(id, appResource) {
    return AppResourceModel.findByIdAndUpdate(id, appResource).then(
      appResource => new AppResouceEntity(appResource.toObject()),
    );
  }

  async find(query) {
    return AppResourceModel.find(query).then(appRoleResources => {
      return appRoleResources.map(appResource => new AppResouceEntity(appResource.toObject()));
    });
  }
}
