import Container from 'typedi';
import StatusRepository from '../../repositories/Status';
import {ObjectId} from 'mongodb';
import Status from '../../types/status';

export default class StatusService {
  private statusRepository: StatusRepository;

  constructor() {
    this.statusRepository = Container.get(StatusRepository);
  }

  async createStatus(status: Status) {
    return this.statusRepository.create(status);
  }

  async deleteStatus(id: string) {
    return this.statusRepository.delete(id);
  }

  async updateStatus(id: string, status: Partial<Status>) {
    return this.statusRepository.update(id, status);
  }

  async findStatus(status: Partial<Status>) {
    return this.statusRepository.find(status);
  }


  async findStatusById(id: string) {
    return this.statusRepository.findById(id);
  }

  async findByID(id: string){
    return this.statusRepository.findById(new ObjectId(id));
  }
}
