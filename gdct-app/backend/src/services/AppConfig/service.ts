import Container from 'typedi';
import AppConfigRepository from '../../repositories/AppConfig';
import { AppConfigDoc } from '../../types/appconfig';

// @Service()
export default class AppConfigService {
  private AppConfigRepository: AppConfigRepository;

  constructor() {
    this.AppConfigRepository = Container.get(AppConfigRepository);
  }

  async createAppConfig(AppConfig: AppConfigDoc) {
    return this.AppConfigRepository.create(AppConfig);
  }

  async findValidationThreshold(){
    return this.AppConfigRepository.findOne({key: "Validation Threshold"});
  }

  async findAttributeRow(){
    return this.AppConfigRepository.findOne({key: "app.SRI.AttributeRow"});
  }

  async deleteAppConfig(id: string) {
    return this.AppConfigRepository.delete(id);
  }

  async updateAppConfig(id: string, AppConfig: AppConfigDoc) {
    return this.AppConfigRepository.update(id, AppConfig);
  }

  async findAppConfig(AppConfig: AppConfigDoc) {
    return this.AppConfigRepository.find(AppConfig.toObject());
  }

  async findAppConfigById(id: string) {
    return this.AppConfigRepository.findById(id);
  }

  async findAllAppConfig() {
    return this.AppConfigRepository.findAll();
  }

  async findSessionCheckingPeriod() {
    return this.AppConfigRepository.findSessionCheckingPeriod();
  }
}
