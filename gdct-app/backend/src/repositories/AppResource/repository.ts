import AppResouceEntity from '../../entities/AppResource';
import BaseRepository from '../repository';
import AppResourceModel from '../../models/AppResource';
import { AppResourceDoc } from '../../types/appresource';
import { FilterQuery } from 'mongoose';

export default class AppResourceRepository extends BaseRepository<AppResourceDoc> {
  constructor() {
    super(AppResourceModel);
  }

  async delete(id: string) {
    const appResource = await AppResourceModel.findById(id);
    if (appResource) {
      appResource.isActive = false;
    }
    return this.update(id, appResource);
  }

  async create(appResource: AppResourceDoc) {
    return AppResourceModel.create(appResource);
  }

  async update(id: string, appResource: AppResourceDoc) {
    return AppResourceModel.findByIdAndUpdate(id, appResource).then(
      (appResource: AppResourceDoc) => new AppResouceEntity(appResource),
    );
  }

  async find(query: FilterQuery<AppResourceDoc>) {
    return AppResourceModel.find(query).then((appRoleResources: AppResourceDoc[]) => {
      return appRoleResources.map(appResource => new AppResouceEntity(appResource));
    });
  }
}
