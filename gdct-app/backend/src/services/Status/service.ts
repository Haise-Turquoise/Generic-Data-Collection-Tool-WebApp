import Container from 'typedi';
import StatusRepository from '../../repositories/Status';
import {ObjectId} from 'mongodb';
import { StatusDoc } from '../../types/status';

export default class StatusService {
  private statusRepository: StatusRepository;

  constructor() {
    this.statusRepository = Container.get(StatusRepository);
  }

  async createStatus(status: StatusDoc) {
    return this.statusRepository.create(status);
  }

  async deleteStatus(id: string) {
    return this.statusRepository.delete(id);
  }

  async updateStatus(id: string, status: Partial<StatusDoc>) {
    return this.statusRepository.update(id, status);
  }

  async findStatus(status: StatusDoc) {
    return this.statusRepository.find(status);
  }


  async findStatusById(id: string) {
    return this.statusRepository.findById(id);
  }

  async findByID(id: string){
    return this.statusRepository.findById(new ObjectId(id));
  }
}
