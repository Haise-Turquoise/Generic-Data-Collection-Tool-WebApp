import Container from 'typedi';
import TemplatePackageRepository from '../../repositories/TemplatePackage';
import StatusRepository from '../../repositories/Status';

// @Service()
export default class TemplatePackageService {
  constructor() {
    this.templatePackageRepository = Container.get(TemplatePackageRepository);
    this.statusRepository = Container.get(StatusRepository)
  }

  async createTemplatePackage(templatePackage) {
    return this.templatePackageRepository.create(templatePackage);
  }

  async deleteTemplatePackage(id) {
    const targetPackageStaus = await this.templatePackageRepository.findStatusById(id);
    if (targetPackageStaus.name === "Published") throw new Error("This Template Package was already published");
    return this.templatePackageRepository.delete(id);
  }

  async updateTemplatePackage(id, templatePackage, isPopulated = false) {
    
    return this.templatePackageRepository.update(id, templatePackage, isPopulated);
  }

  async findTemplatePackage(templatePackage, isPopulated = false) {
    return this.templatePackageRepository.find(templatePackage, isPopulated);
  }
}
