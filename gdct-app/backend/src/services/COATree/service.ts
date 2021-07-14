import { FilterQuery } from 'mongoose';
import Container from 'typedi';
import COATreeRepository from '../../repositories/COATree';
import CategoryTree from '../../types/categorytree';

// @Service()
export default class COATreeService {
  private COATreeRepository: COATreeRepository;
  constructor() {
    this.COATreeRepository = Container.get(COATreeRepository);
  }

  async createCOATree(COATree: CategoryTree) {
    return this.COATreeRepository.create(COATree);
  }

  async deleteCOATree(id: string) {
    return this.COATreeRepository.delete(id);
  }

  async updateCOATree(id: string, COATree: Partial<CategoryTree>) {
    return this.COATreeRepository.update(id, COATree);
  }

  async updateSheetCOATrees(sheetNameId: string, COATrees: CategoryTree[]) {
    return this.COATreeRepository.updateBySheet(sheetNameId, COATrees);
  }

  async findCOATree(COATree: Partial<CategoryTree>) {
    return this.COATreeRepository.find(COATree);
  }
}
