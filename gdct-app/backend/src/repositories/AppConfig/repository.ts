import AppConfigEntity from '../../entities/AppConfig';
import BaseRepository from '../repository';
import AppConfigModel from '../../models/AppConfig';
import AppConfig, { AppConfigDoc } from '../../types/appconfig';

export default class AppConfigRepository extends BaseRepository<AppConfig, AppConfigDoc> {
  constructor() {
    super(AppConfigModel);
  }

  async delete(id: string) {
    const appConfig = await AppConfigModel.findById(id);
    if (appConfig) {
      appConfig.isActive = false;
    }
    return this.update(id, appConfig);
  }

  async create(AppConfig: AppConfigDoc) {
    AppConfig.isActive = true;
    return AppConfigModel.create(AppConfig).then(AppConfig => new AppConfigEntity(AppConfig));
  }

  async update(id: string, AppConfig: AppConfigDoc) {
    return AppConfigModel.findByIdAndUpdate(id, AppConfig).then(
      (AppConfig: AppConfigDoc) => new AppConfigEntity(AppConfig),
    );
  }

  async find(query: Partial<AppConfig>) {
    return AppConfigModel.find(query).then((AppConfigs: AppConfigDoc[]) =>
      AppConfigs.map(AppConfig => new AppConfigEntity(AppConfig)),
    );
  }

  async findById(id: string) {
    return AppConfigModel.findById(id);
  }

  async findAll() {
    return AppConfigModel.find();
  }

  async findSessionCheckingPeriod() {
    return AppConfigModel.findOne({ key: "Session Timer Checking Interval" });
  }

  async findOne(param: Partial<AppConfig>){
    return AppConfigModel.findOne(param);
  }
}