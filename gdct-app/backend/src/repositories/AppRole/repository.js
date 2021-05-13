import AppRoleEntity from '../../entities/AppRole';
import BaseRepository from '../repository';
import AppRoleModel from '../../models/AppRole';

export default class AppRoleRepository extends BaseRepository {
  constructor() {
    super(AppRoleModel);
  }

  async delete(id) {
    const appRole = await AppRoleModel.findById(id);
    if (appRole) {
      appRole.isActive = false;
    }
    return this.update(id, appRole);
  }

  async create(AppRole) {
    AppRole.isActive = true;
    return AppRoleModel.create(AppRole).then(AppRole => new AppRoleEntity(AppRole.toObject()));
  }

  async update(id, AppRole) {
    return AppRoleModel.findByIdAndUpdate(id, AppRole).then(
      AppRole => new AppRoleEntity(AppRole.toObject()),
    );
  }

  async find(query) {
    return AppRoleModel.find(query).then(AppRoles =>
      AppRoles.map(AppRole => new AppRoleEntity(AppRole.toObject())),
    );
  }

  async findByName(name) {
    return AppRoleModel.find({name:name}).then(AppRoles =>
      AppRoles.map(AppRole => new AppRoleEntity(AppRole.toObject())),
    );
  }
}
