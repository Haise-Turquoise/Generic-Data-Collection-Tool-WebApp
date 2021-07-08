import AppSysEntity from '../../entities/AppSys';
import BaseRepository from '../repository';
import AppSysModel from '../../models/AppSys';
import { AppSysDoc } from '../../types/appsys';

export default class AppSysRepository extends BaseRepository<AppSysDoc> {
  constructor() {
    super(AppSysModel);
  }

  async delete(id: string) {
    const appSys = await AppSysModel.findById(id);
    if (appSys) {
      appSys.isActive = false;
    }
    return this.update(id, appSys);
  }

  async create(AppSys: AppSysDoc) {
    AppSys.isActive = true;
    return AppSysModel.create(AppSys).then(AppSys => new AppSysEntity(AppSys));
  }

  async update(id: string, AppSys: AppSysDoc) {
    return AppSysModel.findByIdAndUpdate(id, AppSys).then(
      (AppSys: AppSysDoc) => new AppSysEntity(AppSys.toObject()),
    );
  }

  async findById(id: string) {
    return AppSysModel.findById(id)
  }
  
  async findAll() {
    return AppSysModel.find();
  }
}
