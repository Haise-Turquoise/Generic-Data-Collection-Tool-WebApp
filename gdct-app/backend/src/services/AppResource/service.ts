import Container from 'typedi';
import AppResourceRepository from '../../repositories/AppResource';
import AppResource from '../../types/appresource';

// @Service()
export default class AppResourceService {
  private appResourceRepository: AppResourceRepository;

  constructor() {
    this.appResourceRepository = Container.get(AppResourceRepository);
  }

  async createAppResource(appResource: AppResource) {
    return this.appResourceRepository.create(appResource);
  }

  async deleteAppResource(id: string) {
    return this.appResourceRepository.delete(id);
  }

  async updateAppResource(id: string, appResource: Partial<AppResource>) {
    return this.appResourceRepository.update(id, appResource);
  }

  async findAppResource(appResource: Partial<AppResource>) {
    return this.appResourceRepository.find(appResource);
  }

  async findById(id: string) {
    return this.appResourceRepository.findById(id);
  }
}
