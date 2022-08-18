import Container from 'typedi';
import AttributeConfigRepository from '../../repositories/AttributeConfig';
import AttributeConfig from '../../types/attributeconfig';

// @Service()
export default class AttributeConfigService {
  private AttributeConfigRepository: AttributeConfigRepository;

  constructor() {
    this.AttributeConfigRepository = Container.get(AttributeConfigRepository);
  }

  async createAttributeConfig(AttributeConfig: AttributeConfig) {
    return this.AttributeConfigRepository.create(AttributeConfig);
  }

  async deleteAttributeConfig(id: string) {
    return this.AttributeConfigRepository.deleteById(id);
  }

  async updateAttributeConfig(id: string, AttributeConfig: Partial<AttributeConfig>) {
    return this.AttributeConfigRepository.update(id, AttributeConfig);
  }

  async findAttributeConfig(AttributeConfig: Partial<AttributeConfig>) {
    return this.AttributeConfigRepository.find(AttributeConfig);
  }

  async findAttributeConfigById(id: string) {
    return this.AttributeConfigRepository.findById(id);
  }

  async findAllAttributeConfig() {
    return this.AttributeConfigRepository.findAll();
  }

  async findSessionCheckingPeriod() {
    return this.AttributeConfigRepository.findSessionCheckingPeriod();
  }
}
