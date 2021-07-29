//@ts-ignore
import i18n from 'i18n';
import AppSysRoleEntity from '../../entities/AppSysRole';
import BaseRepository from '../repository';
import AppSysRoleModel from '../../models/AppSysRole';
import AppError from '../../utils/AppError';
import AppSysRole, { AppSysRoleDoc } from '../../types/appsysrole';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

export default class AppSysRoleRepository extends BaseRepository<AppSysRole, AppSysRoleDoc> {
  constructor() {
    super(AppSysRoleModel);
  }

  async delete(id: string) {
    const appSysRole = await AppSysRoleModel.findById(id);
    if (appSysRole) {
      appSysRole.isActive = false;
    }else{
      throw new AppError(`Delete failed, Item not found for AppSysRole item with ID: ${id}`);
    }
    return this.update(id, appSysRole);
  }

  async create(AppSysRole: AppSysRole) {
    AppSysRole.isActive = true;
    return AppSysRoleModel.create(AppSysRole).then(
      AppSysRole => new AppSysRoleEntity(AppSysRole),
    );
  }

  async update(id: string, AppSysRole: Partial<AppSysRole>) {
    return AppSysRoleModel.findByIdAndUpdate(id, AppSysRole).then(
      (AppSysRole: AppSysRoleDoc|null) =>{
        if (!AppSysRole) throw new AppError(`Update failed for AppSysRole item with ID: ${id}, params: ${AppSysRole}`);
        return new AppSysRoleEntity(AppSysRole)
      }
    );
  }

  async find(query: Partial<AppSysRole>) {
    // TODO: filter to be active
    return AppSysRoleModel.find(query).then((AppSysRoles: AppSysRoleDoc[]) =>
      AppSysRoles.map(AppSysRole => new AppSysRoleEntity(AppSysRole)),
    );
  }

  async findById(id: string | ObjectId) {
    //TODO changed logic test this
    return super._model.findById(id).then((result: AppSysRoleDoc|null) => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist'));
      return result.toObject();
    });
  }

  async findAndCreateAppSysRole(appSys: string, role: string) {
    return AppSysRoleModel.findOne({ appSys, role }).then((appSysRole: AppSysRoleDoc|null) => {
      if (appSysRole) return appSysRole;
      return AppSysRoleModel.create({
        role,
        appSys,
        isActive: true,
      });
    });
  }
}
