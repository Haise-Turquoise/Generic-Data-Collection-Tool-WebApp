import AppResouceEntity from '../../entities/AppResource';
import BaseRepository from '../repository';
import AppResourceModel from '../../models/AppResource';
import AppResource, { AppResourceDoc } from '../../types/appresource';
import AppError from '../../utils/AppError';

export default class AppResourceRepository extends BaseRepository<AppResource, AppResourceDoc> {
  constructor() {
    super(AppResourceModel);
  }

  async delete(id: string) {
    const result = await AppResourceModel.findByIdAndDelete(id);
    if (!result) throw new AppError(`Cannot delete AppResource with ID: ${id}, ID does not Exist`);
    return result;
  }

  async create(appResource: AppResource) {
    return AppResourceModel.create(appResource);
  }

  async update(id: string, appResource: Partial<AppResource>) {
    return AppResourceModel.findByIdAndUpdate(id, appResource).then(
      (appResource: AppResourceDoc|null) =>{
        if (appResource) return new AppResouceEntity(appResource);
        throw new AppError(`Cannot update AppResource with ID: ${id}, ID does not Exist`);
    });
  }

  async find(query: Partial<AppResource>) {
    return AppResourceModel.find(query).then((appRoleResources: AppResourceDoc[]) => {
      return appRoleResources.map(appResource => new AppResouceEntity(appResource));
    });
  }
}
