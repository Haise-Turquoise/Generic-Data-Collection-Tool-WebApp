import { FilterQuery } from 'mongoose';
import Container from 'typedi';
import COARepository from '../../repositories/COA';
import MasterValueRepository from '../../repositories/MasterValue';
import { CategoryDoc } from '../../types/category';

// @Service()
export default class COAService {
  private COARepository: COARepository
  private masterValueRepository: MasterValueRepository
  constructor() {
    this.COARepository = Container.get(COARepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createCOA(COA: CategoryDoc | CategoryDoc[]) {
    return this.COARepository.create(COA);
  }

  async findCOAById(id: string) {
    return this.COARepository.findById(id);
  }

  async deleteCOA(id: string) {
    let res = await this.COARepository.findById(id);
    res = await this.masterValueRepository.findByCategoryId(res.id);
    if (!res.length) {
      return this.COARepository.delete(id);
    } else {
      throw new Error("COA exists in mastervalue");
    }
  }

  async updateCOA(id: string, COA: Partial<CategoryDoc>) {
    return this.COARepository.update(id, COA);
  }

  async findCOA(COA: FilterQuery<CategoryDoc>) {
    return this.COARepository.find(COA);
  }
}
