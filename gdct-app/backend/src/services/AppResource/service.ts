import Container from 'typedi';
import AppResourceRepository from '../../repositories/AppResource';
import { AppResourceDoc } from '../../types/appresource';

// @Service()
export default class AppResourceService {
  private appResourceRepository: AppResourceRepository;

  constructor() {
    this.appResourceRepository = Container.get(AppResourceRepository);
  }

  async createAppResource(appResource: AppResourceDoc) {
    return this.appResourceRepository.create(appResource);
  }

  async deleteAppResource(id: string) {
    return this.appResourceRepository.delete(id);
  }

  async updateAppResource(id: string, appResource: AppResourceDoc) {
    return this.appResourceRepository.update(id, appResource);
  }

  async findAppResource(appResource: AppResourceDoc) {
    return this.appResourceRepository.find(appResource.toObject());
  }

  async findById(id: string) {
    return this.appResourceRepository.findById(id);
  }
}
