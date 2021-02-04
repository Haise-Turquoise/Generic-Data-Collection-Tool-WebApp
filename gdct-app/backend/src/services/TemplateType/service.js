import Container from 'typedi';
import TemplateTypeRepository from '../../repositories/TemplateType';
import SubmissionRepository from '../../repositories/Submission';
import TemplateRepository from '../../repositories/Template';

// @Service()
export default class TemplateTypeService {
  constructor() {
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.submissionRepository = Container.get(SubmissionRepository);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async createTemplateType(templateType) {
    return this.templateTypeRepository.create(templateType);
  }

  async deleteTemplateType(id) {
    const templates = await this.templateRepository.findTemplateIDByTypeID(id);
    templates.map(template=>template._id);
    const submission = await this.submissionRepository.findOneByTemplateIDs(templates);
    if (submission != null) throw new Error('Template types already referenced');
    return this.templateTypeRepository.delete(id);
  }

  async updateTemplateType(id, templateType) {
    return this.templateTypeRepository.update(id, templateType);
  }

  async findTemplateType(templateType) {
    return this.templateTypeRepository.find(templateType);
  }

  async findTemplateTypeByProgramIds(programIds) {
    return this.templateTypeRepository.findByProgramIds(programIds);
  }
}
