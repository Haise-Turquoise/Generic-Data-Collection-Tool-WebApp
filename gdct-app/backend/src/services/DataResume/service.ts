import Container from 'typedi';
import DataResumeRepository from '../../repositories/DataResume';
import DataResume from '../../types/dataresume';

// @Service()
export default class DataResumeService {
  private dataResumeRepository: DataResumeRepository;

  constructor() {
    this.dataResumeRepository = Container.get(DataResumeRepository);
  }

  async createDataResume(dataResume: DataResume) {
    return this.dataResumeRepository.create(dataResume);
  }

  async deleteDataResume(id: string) {
    return this.dataResumeRepository.delete(id);
  }

  async updateDataResume(dataResume: Partial<DataResume>) {
    return this.dataResumeRepository.update(dataResume._id!, dataResume);
  }

  async findDataResume(dataResume: Partial<DataResume>) {
    return this.dataResumeRepository.find(dataResume);
  }
}