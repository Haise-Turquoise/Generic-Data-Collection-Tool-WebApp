import Container from 'typedi';
import COAGroupRepository from '../../repositories/COAGroup';
import COATreeRepository from '../../repositories/COATree';
import { CategoryGroupDoc } from '../../types/categorygroup';

// @Service()
export default class COAGroupService {
  private COAGroupRepository: COAGroupRepository;
  private COATreeRepository: COATreeRepository;
  constructor() {
    this.COAGroupRepository = Container.get(COAGroupRepository);
    this.COATreeRepository = Container.get(COATreeRepository)
  }

  async createCOAGroup(COAGroup: CategoryGroupDoc) {
    return this.COAGroupRepository.create(COAGroup);
  }

  async deleteCOAGroup(id: string) {
    const coaTreeResult = await this.COATreeRepository.findOneByCategoryGroupId(id);
    if (coaTreeResult != null) throw new Error("This category group is used in COA tree");
    return this.COAGroupRepository.delete(id);
  }

  async updateCOAGroup(id: string, COAGroup: Partial<CategoryGroupDoc>) {
    return this.COAGroupRepository.update(id, COAGroup);
  }

  async findCOAGroup(COAGroup: Partial<CategoryGroupDoc>) {
    return this.COAGroupRepository.find(COAGroup);
  }

  async findById(id: string) {
    return this.COAGroupRepository.findById(id);  
  }
}
