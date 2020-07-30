import Container from 'typedi';
import TemplatePackageRepository from '../../repositories/TemplatePackage';

// @Service()
export default class TemplatePackageService {
  constructor() {
    this.templatePackageRepository = Container.get(TemplatePackageRepository);
  }

  async createTemplatePackage(templatePackage) {
    return this.templatePackageRepository.create(templatePackage);
  }

  async deleteTemplatePackage(id) {
    return this.templatePackageRepository.delete(id);
  }

  async updateTemplatePackage(id, templatePackage, isPopulated = false) {
    return this.templatePackageRepository.update(id, templatePackage, isPopulated);
  }

  async findTemplatePackage(templatePackage, isPopulated = false) {
    return this.templatePackageRepository.find(templatePackage, isPopulated);
  }
}
