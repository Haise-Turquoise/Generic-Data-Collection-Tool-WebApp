import Container from 'typedi';
import COARepository from '../../repositories/COA';
import MasterValueRepository from '../../repositories/MasterValue';

// @Service()
export default class COAService {
  constructor() {
    this.COARepository = Container.get(COARepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createCOA(COA) {
    return this.COARepository.create(COA);
  }

  async findById(id){
    return this.COARepository.find({ _id: id })
  }

  async deleteCOA(id) {
    let res = await this.COARepository.findById(id);
    res = await this.masterValueRepository.findByCategoryId(res.id)
    if (!res.length){
      return this.COARepository.delete(id);
    } else {
      throw new Error("COA exists in mastervalue");
    }
  }

  async updateCOA(id, COA) {
    return this.COARepository.update(id, COA);
  }

  async findCOA(COA) {
    return this.COARepository.find(COA);
  }
}
