import Container from 'typedi';
import AppConfigRepository from '../../repositories/AppConfig';
import AppConfig from '../../types/appconfig';

// @Service()
export default class AppConfigService {
  private AppConfigRepository: AppConfigRepository;

  constructor() {
    this.AppConfigRepository = Container.get(AppConfigRepository);
  }

  async createAppConfig(AppConfig: AppConfig) {
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

  async updateAppConfig(id: string, AppConfig: Partial<AppConfig>) {
    return this.AppConfigRepository.update(id, AppConfig);
  }

  async findAppConfig(AppConfig: Partial<AppConfig>) {
    return this.AppConfigRepository.find(AppConfig);
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
