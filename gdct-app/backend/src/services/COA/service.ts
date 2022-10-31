import Container from 'typedi';
import AppResource from '../../entities/AppResource';
import COARepository from '../../repositories/COA';
import MasterValueRepository from '../../repositories/MasterValue';
import Category from '../../types/category';
import AppError from '../../utils/AppError';

// @Service()
export default class COAService {
  private COARepository: COARepository
  private masterValueRepository: MasterValueRepository
  constructor() {
    this.COARepository = Container.get(COARepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createCOA(COA: Category | Category[]) {
    return this.COARepository.create(COA);
  }

  async findCOAById(id: string) {
    return this.COARepository.findById(id);
  }

  async deleteCOA(id: string) {
    const res = await this.COARepository.findById(id);
    if (!res) throw new AppError(`Cannot find COA item by Id ${id}`);
    const res2 = await this.masterValueRepository.findByCategoryId(res.id);
    if (!res2.length) {
      return this.COARepository.delete(id);
    } else {
      throw new Error("COA exists in mastervalue");
    }
  }

  async updateCOA(id: string, COA: Partial<Category>) {
    return this.COARepository.update(id, COA);
  }

  async findCOA(COA: Partial<Category>) {
    return this.COARepository.find(COA);
  }

  async updateMapping(id: string, COA: Partial<Category>) {
    return this.COARepository.updateMapping(id,COA);
  }
}
