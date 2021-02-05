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
    //if (await this.isRefered(id)) {
    //  throw Error('existed appSysRole');
    //}
    return this.AppConfigRepository.delete(id);
  }

  async updateAppConfig(id, AppConfig) {
    return this.AppConfigRepository.update(id, AppConfig);
  }

  async findAppConfig(AppConfig) {
    return this.AppConfigRepository.find(AppConfig);
  }

  async findAllAppConfig() {
    return this.AppConfigRepository.findAll();
  }

//  async isRefered(id) {
//    const appConfig = await this.AppConfigRepository.findById(id);
//    console.log('code:', appConfig.code);
//    const appSysRole = await this.AppConfigRoleRepository.find({ appConfig: appConfig.code });
//    return appSysRole.length !== 0;
//  }
}
