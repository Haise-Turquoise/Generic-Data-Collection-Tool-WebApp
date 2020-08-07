import COAEntity from '../../entities/COA';
import BaseRepository from '../repository';
import COAModel from '../../models/COA';

export default class COARepository extends BaseRepository {
  constructor() {
    super(COAModel);
  }

  async delete(id) {
    return COAModel.findByIdAndDelete(id).then(COA => new COAEntity(COA.toObject()));
  }

  async create(COA) {
    return COAModel.create(COA).then(COA => new COAEntity(COA.toObject()));
  }

  async update(id, COA) {
    return COAModel.findByIdAndUpdate(id, COA).then(COA => new COAEntity(COA.toObject()));
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return COAModel.find({}).then(COAs => COAs.map(COA => new COAEntity(COA.toObject())));
  }
}
