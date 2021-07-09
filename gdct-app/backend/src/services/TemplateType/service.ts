import Container from 'typedi';
import TemplateTypeRepository from '../../repositories/TemplateType';
import SubmissionRepository from '../../repositories/Submission';
import TemplateRepository from '../../repositories/Template';
import { TemplateTypeDoc } from '../../types/templatetype';
import { ObjectId } from 'mongodb'

// @Service()
export default class TemplateTypeService {
  private templateTypeRepository: TemplateTypeRepository;
  private submissionRepository: SubmissionRepository;
  private templateRepository: TemplateRepository;

  constructor() {
    this.templateTypeRepository = Container.get(TemplateTypeRepository);
    this.submissionRepository = Container.get(SubmissionRepository);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async createTemplateType(templateType: TemplateTypeDoc) {
    return this.templateTypeRepository.create(templateType);
  }

  async deleteTemplateType(id: string) {
    const templates = await this.templateRepository.findTemplateIDByTypeID(id);
    templates.map((template: TemplateTypeDoc)=>template._id);
    const submission = await this.submissionRepository.findOneByTemplateIDs(templates);
    if (submission != null) throw new Error('Template types already referenced');
    return this.templateTypeRepository.delete(id);
  }

  async updateTemplateType(id: string, templateType: Partial<TemplateTypeDoc>) {
    return this.templateTypeRepository.update(id, templateType);
  }

  async findTemplateType(templateType: TemplateTypeDoc) {
    return this.templateTypeRepository.find(templateType);
  }

  async findTemplateTypeByProgramIds(programIds: ObjectId[]) {
    return this.templateTypeRepository.findByProgramIds(programIds);
  }

  async findById(id: string) {
    return this.templateTypeRepository.findById(id);
  }
}
