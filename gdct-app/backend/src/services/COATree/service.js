import Container from 'typedi';
import COATreeRepository from '../../repositories/COATree';

// @Service()
export default class COATreeService {
  constructor() {
    this.COATreeRepository = Container.get(COATreeRepository);
  }

  async createCOATree(COATree) {
    return this.COATreeRepository.create(COATree);
  }

  async deleteCOATree(id) {
    return this.COATreeRepository.delete(id);
  }

  async updateCOATree(id, COATree) {
    return this.COATreeRepository.update(id, COATree);
  }

  async updateSheetCOATrees(sheetNameId, COATrees) {
    return this.COATreeRepository.updateBySheet(sheetNameId, COATrees);
  }

  async findCOATree(COATree) {
    return this.COATreeRepository.find(COATree);
  }
}
