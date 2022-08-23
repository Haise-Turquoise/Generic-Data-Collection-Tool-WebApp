import AppSysEntity from '../../entities/AppSys';
import BaseRepository from '../repository';
import AppSysModel from '../../models/AppSys';
import AppSys, { AppSysDoc } from '../../types/appsys';
import AppError from '../../utils/AppError';
import {dateStringTranslate} from '../../utils/misc';

export default class AppSysRepository extends BaseRepository<AppSys, AppSysDoc> {
  constructor() {
    super(AppSysModel);
  }

  async delete(id: string) {
    const appSys = await AppSysModel.findById(id);
    if (appSys) {
      appSys.isActive = false;
    }else{
      throw new AppError(`Item not found for AppSysModel item with ID: ${id}`);
    }
    return this.update(id, appSys);
  }

  async create(AppSys: AppSys) {
    AppSys.isActive = true;
    AppSys.updatedAt = dateStringTranslate(new Date(AppSys.updatedAt));
    return AppSysModel.create(AppSys).then(AppSys => new AppSysEntity(AppSys));
  }

  async update(id: string, AppSys: Partial<AppSys>) {
    AppSys.updatedAt = dateStringTranslate(new Date(AppSys.updatedAt));
    return AppSysModel.findByIdAndUpdate(id, AppSys).then(
      (AppSys: AppSysDoc|null) => {
        if (!AppSys) throw new AppError(`Item update failed for AppSysModel item with ID: ${id}`);
        return new AppSysEntity(AppSys)
      }
    );
  }

  async findById(id: string) {
    return AppSysModel.findById(id)
  }
  
  async findAll() {
    return AppSysModel.find();
  }
}
