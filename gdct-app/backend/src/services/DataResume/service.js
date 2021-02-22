import Container from 'typedi';
import DataResumeRepository from '../../repositories/DataResume';

// @Service()
export default class SheetNameService {
  constructor() {
    this.dataResumeRepository = Container.get(DataResumeRepository);
  }

  async createDataResume(dataResume) {
    return this.dataResumeRepository.create(dataResume);
  }

  async deleteDataResume(id) {
    return this.dataResumeRepository.delete(id);
  }

  async updateDataResume(dataResume) {
    return this.dataResumeRepository.update(dataResume);
  }

  async findDataResume(dataResume) {
    return this.dataResumeRepository.find(dataResume);
  }
}