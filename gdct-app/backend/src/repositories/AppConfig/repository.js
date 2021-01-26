import AppConfigEntity from '../../entities/AppConfig';
import BaseRepository from '../repository';
import AppConfigModel from '../../models/AppConfig';

export default class AppConfigRepository extends BaseRepository {
  constructor() {
    super(AppConfigModel);
  }

  async delete(id) {
    const appConfig = await AppConfigModel.findById(id);
    if (appConfig) {
      appConfig.isActive = false;
    }
    return this.update(id, appConfig);
  }

  async create(AppConfig) {
    AppConfig.isActive = true;
    return AppConfigModel.create(AppConfig).then(AppConfig => new AppConfigEntity(AppConfig.toObject()));
  }

  async update(id, AppConfig) {
    return AppConfigModel.findByIdAndUpdate(id, AppConfig).then(
      AppConfig => new AppConfigEntity(AppConfig.toObject()),
    );
  }

  async find(query) {
    return AppConfigModel.find(query).then(AppConfigs =>
      AppConfigs.map(AppConfig => new AppConfigEntity(AppConfig.toObject())),
    );
  }

  async findAll() {
    return AppConfigModel.find();
  }
}
