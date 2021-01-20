import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';

// @Service()
export default class MasterValueService {
  constructor() {
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createMasterValue(masterValue) {
    return this.masterValueRepository.create(masterValue);
  }

  async deleteMasterValue(id) {
    return this.masterValueRepository.delete(id);
  }

  async updateMasterValue(id, masterValue) {
    return this.masterValueRepository.update(id, masterValue);
  }

  async findMasterValue(masterValue) {
    return this.masterValueRepository.find(masterValue);
  }
  async addDocument(masterValue){
    console.log('masterValue at service',masterValue)
    return this.masterValueRepository.addDocument(masterValue)
  }
}
