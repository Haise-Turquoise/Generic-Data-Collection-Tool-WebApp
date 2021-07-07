import Container from 'typedi';
import COATreeRepository from '../../repositories/COATree';
import { CategoryTreeDoc } from '../../types/categorytree';

// @Service()
export default class COATreeService {
  private COATreeRepository: COATreeRepository;
  constructor() {
    this.COATreeRepository = Container.get(COATreeRepository);
  }

  async createCOATree(COATree: CategoryTreeDoc) {
    return this.COATreeRepository.create(COATree);
  }

  async deleteCOATree(id: string) {
    return this.COATreeRepository.delete(id);
  }

  async updateCOATree(id: string, COATree: Partial<CategoryTreeDoc>) {
    return this.COATreeRepository.update(id, COATree);
  }

  async updateSheetCOATrees(sheetNameId: string, COATrees: CategoryTreeDoc[]) {
    return this.COATreeRepository.updateBySheet(sheetNameId, COATrees);
  }

  async findCOATree(COATree: Partial<CategoryTreeDoc>) {
    return this.COATreeRepository.find(COATree);
  }
}
