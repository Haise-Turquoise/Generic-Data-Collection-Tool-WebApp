import StatusEntity from '../../entities/Status';
import BaseRepository from '../repository';
import StatusModel from '../../models/Status';

export default class StatusRepository extends BaseRepository {
  constructor() {
    super(StatusModel);
  }

  async delete(id) {
    return StatusModel.findByIdAndDelete(id).then(status => new StatusEntity(status));
  }

  async create(status) {
    return StatusModel.create(status).then(status => new StatusEntity(status));
  }

  async update(id, status) {
    return StatusModel.findByIdAndUpdate(id, status).then(status => new StatusEntity(status));
  }

  async findByName(name) {
    return StatusModel.find({ name });
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return StatusModel.find(realQuery).then(statuses =>
      statuses.map(status => new StatusEntity(status.toObject())),
    );
  }
}
