import StatusEntity from '../../entities/Status';
import BaseRepository from '../repository';
import StatusModel from '../../models/Status';
import Status, { StatusDoc } from '../../types/status';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

export default class StatusRepository extends BaseRepository<Status, StatusDoc> {
  constructor() {
    super(StatusModel);
  }

  async delete(id: string) {
    return StatusModel.findByIdAndDelete(id).then((status: StatusDoc) => new StatusEntity(status));
  }

  async create(status: Status) {
    return StatusModel.create(status).then(status => new StatusEntity(status));
  }

  async update(id: string, status: Partial<Status>) {
    return StatusModel.findByIdAndUpdate(id, status).then((status: StatusDoc) => new StatusEntity(status));
  }

  async findByName(name: string) {
    return StatusModel.find({ name });
  }

  async findById(id: string | ObjectId){
    return StatusModel.findById(id);
  }

  async find(query: Partial<Status>) {
    const realQuery: FilterQuery<StatusDoc> = {};
    let key: keyof Status;
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return StatusModel.find(realQuery).then((statuses: StatusDoc[]) =>
      statuses.map(status => new StatusEntity(status)),
    );
  }
}
