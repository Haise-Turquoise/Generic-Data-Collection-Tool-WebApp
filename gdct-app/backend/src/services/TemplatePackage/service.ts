import Container from 'typedi';
import TemplatePackageRepository from '../../repositories/TemplatePackage';
import StatusRepository from '../../repositories/Status';
import TemplatePackage from '../../types/templatepackage';
import AppError from '../../utils/AppError';

// @Service()
export default class TemplatePackageService {
  private templatePackageRepository: TemplatePackageRepository;
  private statusRepository: StatusRepository;

  constructor() {
    this.templatePackageRepository = Container.get(TemplatePackageRepository);
    this.statusRepository = Container.get(StatusRepository)
  }

  async createTemplatePackage(templatePackage: TemplatePackage) {
    return this.templatePackageRepository.create(templatePackage);
  }

  async deleteTemplatePackage(id: string) {
    const targetPackageStaus = await this.templatePackageRepository.findStatusById(id);
    if (!targetPackageStaus) throw new AppError(`Cannot find stauts related to template package with ID ${id}`);
    if (targetPackageStaus.name === "Published") throw new Error("This Template Package was already published");
    return this.templatePackageRepository.delete(id);
  }

  async updateTemplatePackage(id: string, templatePackage: Partial<TemplatePackage>, isPopulated = false) {
    
    return this.templatePackageRepository.update(id, templatePackage, isPopulated);
  }

  async findTemplatePackage(templatePackage: Partial<TemplatePackage>, isPopulated = false) {
    return this.templatePackageRepository.find(templatePackage, isPopulated);
  }
}
