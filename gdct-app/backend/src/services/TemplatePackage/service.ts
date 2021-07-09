import Container from 'typedi';
import TemplatePackageRepository from '../../repositories/TemplatePackage';
import StatusRepository from '../../repositories/Status';
import { TemplatePackageDoc } from '../../types/templatepackage';

// @Service()
export default class TemplatePackageService {
  private templatePackageRepository: TemplatePackageRepository;
  private statusRepository: StatusRepository;

  constructor() {
    this.templatePackageRepository = Container.get(TemplatePackageRepository);
    this.statusRepository = Container.get(StatusRepository)
  }

  async createTemplatePackage(templatePackage: TemplatePackageDoc) {
    return this.templatePackageRepository.create(templatePackage);
  }

  async deleteTemplatePackage(id: string) {
    const targetPackageStaus = await this.templatePackageRepository.findStatusById(id);
    if (targetPackageStaus.name === "Published") throw new Error("This Template Package was already published");
    return this.templatePackageRepository.delete(id);
  }

  async updateTemplatePackage(id: string, templatePackage: TemplatePackageDoc, isPopulated = false) {
    
    return this.templatePackageRepository.update(id, templatePackage, isPopulated);
  }

  async findTemplatePackage(templatePackage: TemplatePackageDoc, isPopulated = false) {
    return this.templatePackageRepository.find(templatePackage, isPopulated);
  }
}
