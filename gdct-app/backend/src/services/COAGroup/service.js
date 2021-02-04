import Container from 'typedi';
import COAGroupRepository from '../../repositories/COAGroup';
import COATreeRepository from '../../repositories/COATree';

// @Service()
export default class COAGroupService {
  constructor() {
    this.COAGroupRepository = Container.get(COAGroupRepository);
    this.COATreeRepository = Container.get(COATreeRepository)
  }

  async createCOAGroup(COAGroup) {
    return this.COAGroupRepository.create(COAGroup);
  }

  async deleteCOAGroup(id) {
    const coaTreeResult = await this.COATreeRepository.findOneByCategoryGroupId(id);
    if (coaTreeResult != null) throw new Error("This category group is used in COA tree");
    return this.COAGroupRepository.delete(id);
  }

  async updateCOAGroup(id, COAGroup) {
    return this.COAGroupRepository.update(id, COAGroup);
  }

  async findCOAGroup(COAGroup) {
    return this.COAGroupRepository.find(COAGroup);
  }
}
