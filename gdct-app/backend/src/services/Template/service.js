import Container from 'typedi';
import TemplateRepository from '../../repositories/Template';

// @Service()
export default class TemplateService {
  constructor() {
    this.templateRepository = Container.get(TemplateRepository);
  }

  async createTemplate(template) {
    return this.templateRepository.create(template);
  }

  async deleteTemplate(id) {
    return this.templateRepository.delete(id);
  }

  async updateTemplate(id, template) {
    return this.templateRepository.update(id, template);
  }

  async findTemplate(template) {
    return this.templateRepository.find(template);
  }

  async findTemplateById(id) {
    return this.templateRepository.findById(id);
  }
}
