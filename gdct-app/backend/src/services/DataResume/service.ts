import Container from 'typedi';
import DataResumeRepository from '../../repositories/DataResume';
import { DataResumeDoc } from '../../types/dataresume';

// @Service()
export default class DataResumeService {
  private dataResumeRepository: DataResumeRepository;

  constructor() {
    this.dataResumeRepository = Container.get(DataResumeRepository);
  }

  async createDataResume(dataResume: DataResumeDoc) {
    return this.dataResumeRepository.create(dataResume);
  }

  async deleteDataResume(id: string) {
    return this.dataResumeRepository.delete(id);
  }

  async updateDataResume(dataResume: DataResumeDoc) {
    return this.dataResumeRepository.update(dataResume._id, dataResume);
  }

  async findDataResume(dataResume: DataResumeDoc) {
    return this.dataResumeRepository.find(dataResume.toObject());
  }
}