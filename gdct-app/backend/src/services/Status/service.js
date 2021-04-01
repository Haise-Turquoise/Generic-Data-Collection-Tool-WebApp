import Container from 'typedi';
import StatusRepository from '../../repositories/Status';
import {ObjectId} from 'mongodb';

export default class StatusService {
  constructor() {
    this.statusRepository = Container.get(StatusRepository);
  }

  async createStatus(status) {
    return this.statusRepository.create(status);
  }

  async deleteStatus(id) {
    return this.statusRepository.delete(id);
  }

  async updateStatus(id, status) {
    return this.statusRepository.update(id, status);
  }

  async findStatus(status) {
    return this.statusRepository.find(status);
  }


  async findStatusById(id) {
    return this.statusRepository.findById(id);

  async findByID(id){
    return this.statusRepository.findOneByID(new ObjectId(id));

  }
}
