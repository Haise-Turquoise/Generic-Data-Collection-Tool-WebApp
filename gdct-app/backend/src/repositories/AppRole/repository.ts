import AppRoleEntity from '../../entities/AppRole';
import BaseRepository from '../repository';
import AppRoleModel from '../../models/AppRole';
import AppRole, { AppRoleDoc } from '../../types/approle';
import { FilterQuery } from 'mongoose';

export default class AppRoleRepository extends BaseRepository<AppRole, AppRoleDoc> {
  constructor() {
    super(AppRoleModel);
  }

  async delete(id: string) {
    const appRole = await AppRoleModel.findById(id);
    if (appRole) {
      appRole.isActive = false;
    }
    return this.update(id, appRole);
  }

  async create(AppRole: AppRole) {
    AppRole.isActive = true;
    return AppRoleModel.create(AppRole).then(AppRole => new AppRoleEntity(AppRole));
  }

  async update(id: string, AppRole: Partial<AppRole>) {
    return AppRoleModel.findByIdAndUpdate(id, AppRole);
  }

  async find(query: Partial<AppRole>) {
    return AppRoleModel.find(query).then((AppRoles: AppRoleDoc[]) =>
      AppRoles.map(AppRole => new AppRoleEntity(AppRole)),
    );
  }

  async findByName(name: string) {
    return AppRoleModel.find({name:name}).then((AppRoles: AppRoleDoc[]) =>
      AppRoles.map(AppRole => new AppRoleEntity(AppRole)),
    );
  }
}
