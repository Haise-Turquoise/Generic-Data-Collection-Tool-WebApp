import AppConfigEntity from '../../entities/AppConfig';
import BaseRepository from '../repository';
import AppConfigModel from '../../models/AppConfig';
import AppConfig, { AppConfigDoc } from '../../types/appconfig';
import {dateStringTranslate} from '../../utils/misc';
import AppError from '../../utils/AppError';

export default class AppConfigRepository extends BaseRepository<AppConfig, AppConfigDoc> {
  constructor() {
    super(AppConfigModel);
  }

  async deleteById(id: string) {
    const appConfig = await AppConfigModel.findById(id);
    if (appConfig) {
      appConfig.isActive = false;
    }else{
      throw new AppError(`Cannot find AppConfig with ID: ${id}`);
    }
    return this.update(id, appConfig);
  }

  async create(AppConfig: AppConfig) {
    AppConfig.isActive = true;
    AppConfig.updatedAt = dateStringTranslate(new Date(AppConfig.updatedAt));
    return AppConfigModel.create(AppConfig).then(AppConfig => new AppConfigEntity(AppConfig));
  }

  async update(id: string, AppConfig: Partial<AppConfig>) {
    AppConfig.updatedAt = dateStringTranslate(new Date(AppConfig.updatedAt));
    return AppConfigModel.findByIdAndUpdate(id, AppConfig).then(
      (AppConfig: AppConfigDoc|null) => {
        if (!AppConfig) return undefined;
        return new AppConfigEntity(AppConfig)
      });
  }

  async find(query: Partial<AppConfig>) {
    return AppConfigModel.find(query).then((AppConfigs: AppConfigDoc[]|null) =>{
      if (AppConfigs){
        return AppConfigs.map(AppConfig => new AppConfigEntity(AppConfig));
      }else{
        return [];
      }
    });
  }

  async findById(id: string) {
    const result = await AppConfigModel.findById(id);
    if (!result){
      throw new AppError(`Cannot find AppConfig with ID: ${id}`);
    }
    return result;
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