import Container from 'typedi';
import AppConfigRepository from '../../repositories/AppConfig';

// @Service()
export default class AppConfigService {
  constructor() {
    this.AppConfigRepository = Container.get(AppConfigRepository);
  }

  async createAppConfig(AppConfig) {
    return this.AppConfigRepository.create(AppConfig);
  }

  async deleteAppConfig(id) {
    return this.AppConfigRepository.delete(id);
  }

  async updateAppConfig(id, AppConfig) {
    return this.AppConfigRepository.update(id, AppConfig);
  }

  async findAppConfig(AppConfig) {
    return this.AppConfigRepository.find(AppConfig);
  }

  async findAppConfigById(id) {
    return this.AppConfigRepository.findById(id);
  }

  async findAllAppConfig() {
    return this.AppConfigRepository.findAll();
  }

  async findSessionCheckingPeriod() {
    return this.AppConfigRepository.findSessionCheckingPeriod();
  }
}
