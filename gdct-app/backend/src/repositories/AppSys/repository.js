import AppSysEntity from '../../entities/AppSys';
import BaseRepository from '../repository';
import AppSysModel from '../../models/AppSys';

export default class AppSysRepository extends BaseRepository {
  constructor() {
    super(AppSysModel);
  }

  async delete(id) {
    const appSys = await AppSysModel.findById(id);
    if (appSys) {
      appSys.isActive = false;
    }
    return this.update(id, appSys);
  }

  async create(AppSys) {
    AppSys.isActive = true;
    // @ts-ignore
    return AppSysModel.create(AppSys).then(AppSys => new AppSysEntity(AppSys.toObject()));
  }

  async update(id, AppSys) {
    return AppSysModel.findByIdAndUpdate(id, AppSys).then(
      AppSys => new AppSysEntity(AppSys.toObject()),
    );
  }

  async findById(id) {
    return AppSysModel.findById(id)
  }
  
  async findAll() {
    return AppSysModel.find();
  }
}
