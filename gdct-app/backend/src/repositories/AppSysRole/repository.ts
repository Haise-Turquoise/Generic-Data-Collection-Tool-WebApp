import i18n from 'i18n';
import AppSysRoleEntity from '../../entities/AppSysRole';
import BaseRepository from '../repository';
import AppSysRoleModel from '../../models/AppSysRole';
import AppError from '../../utils/AppError';
import { AppSysRoleDoc } from '../../types/appsysrole';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

export default class AppSysRoleRepository extends BaseRepository<AppSysRoleDoc> {
  constructor() {
    super(AppSysRoleModel);
  }

  async delete(id: string) {
    const appSysRole = await AppSysRoleModel.findById(id);
    if (appSysRole) {
      appSysRole.isActive = false;
    }
    return this.update(id, appSysRole);
  }

  async create(AppSysRole: AppSysRoleDoc) {
    AppSysRole.isActive = true;
    return AppSysRoleModel.create(AppSysRole).then(
      AppSysRole => new AppSysRoleEntity(AppSysRole),
    );
  }

  async update(id: string, AppSysRole: AppSysRoleDoc) {
    return AppSysRoleModel.findByIdAndUpdate(id, AppSysRole).then(
      (AppSysRole: AppSysRoleDoc) => new AppSysRoleEntity(AppSysRole),
    );
  }

  async find(query: FilterQuery<AppSysRoleDoc>) {
    // TODO: filter to be active
    return AppSysRoleModel.find(query).then((AppSysRoles: AppSysRoleDoc[]) =>
      AppSysRoles.map(AppSysRole => new AppSysRoleEntity(AppSysRole)),
    );
  }

  async findById(id: string | ObjectId) {
    return this._model.findById(id).then((result: AppSysRoleDoc) => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist'));
      return result.toObject();
    });
  }

  async findAndCreateAppSysRole(appSys: string, role: string) {
    return AppSysRoleModel.findOne({ appSys, role }).then((appSysRole: AppSysRoleDoc) => {
      if (appSysRole) return appSysRole;
      return AppSysRoleModel.create({
        role,
        appSys,
        isActive: true,
      });
    });
  }
}
