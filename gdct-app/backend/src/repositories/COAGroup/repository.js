import COAGroupEntity from '../../entities/COAGroup';
import BaseRepository from '../repository';
import COAGroupModel from '../../models/COAGroup';

export default class COAGroupRepository extends BaseRepository {
  constructor() {
    super(COAGroupModel);
  }
  async delete(id) {
    return COAGroupModel.findByIdAndDelete(id).then(
      COAGroup => new COAGroupEntity(COAGroup.toObject()),
    );
  }

  async create(COAGroup) {
    return COAGroupModel.create(COAGroup).then(COAGroup => new COAGroupEntity(COAGroup.toObject()));
  }

  async update(id, COAGroup) {
    return COAGroupModel.findByIdAndUpdate(id, COAGroup).then(
      COAGroup => new COAGroupEntity(COAGroup.toObject()),
    );
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return COAGroupModel.find(realQuery).then(COAGroups =>
      COAGroups.map(COAGroup => new COAGroupEntity(COAGroup.toObject())),
    );
  }

  async batchFind(query){
    return COAGroupModel.find({ _id: { "$in" : query }})
  }
}
