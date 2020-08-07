import AppSysRoleEntity from '../../entities/AppSysRole';
import BaseRepository from '../repository';
import AppSysRoleModel from '../../models/AppSysRole';

export default class AppSysRoleRepository extends BaseRepository {
  constructor() {
    super(AppSysRoleModel);
  }

  async delete(id) {
    const appSysRole = await AppSysRoleModel.findById(id);
    if (appSysRole) {
      appSysRole.isActive = false;
    }
    return this.update(id, appSysRole);
  }

  async create(AppSysRole) {
    AppSysRole.isActive = true;
    return AppSysRoleModel.create(AppSysRole).then(
      AppSysRole => new AppSysRoleEntity(AppSysRole.toObject()),
    );
  }

  async update(id, AppSysRole) {
    return AppSysRoleModel.findByIdAndUpdate(id, AppSysRole).then(
      AppSysRole => new AppSysRoleEntity(AppSysRole.toObject()),
    );
  }

  async find(query) {
    // TODO: filter to be active
    return AppSysRoleModel.find(query).then(AppSysRoles =>
      AppSysRoles.map(AppSysRole => new AppSysRoleEntity(AppSysRole.toObject())),
    );
  }

  async findById(id) {
    return this._model.findById(id).then(result => {
      if (!result) throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async findAndCreateAppSysRole(appSys, role) {
    return AppSysRoleModel.findOne({ appSys, role }).then(appSysRole => {
      if (appSysRole) return appSysRole;
      return AppSysRoleModel.create({
        role,
        appSys,
        isActive: true,
      });
    });
  }
}
