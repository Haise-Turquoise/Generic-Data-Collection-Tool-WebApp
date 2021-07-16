import COAGroupEntity from '../../entities/COAGroup';
import BaseRepository from '../repository';
import COAGroupModel from '../../models/COAGroup';
import CategoryGroup, { CategoryGroupDoc } from '../../types/categorygroup';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

export default class COAGroupRepository extends BaseRepository<CategoryGroup, CategoryGroupDoc> {
  constructor() {
    super(COAGroupModel);
  }
  async delete(id: string) {
    return COAGroupModel.findByIdAndDelete(id).then(
      (COAGroup: CategoryGroupDoc) => new COAGroupEntity(COAGroup),
    );
  }

  async create(COAGroup: CategoryGroup) {
    return COAGroupModel.create(COAGroup).then(COAGroup => new COAGroupEntity(COAGroup));
  }

  async update(id: string, COAGroup: Partial<CategoryGroup>) {
    return COAGroupModel.findByIdAndUpdate(id, COAGroup).then(
      (COAGroup: CategoryGroupDoc) => new COAGroupEntity(COAGroup),
    );
  }

  async find(query: Partial<CategoryGroup>) {
    const realQuery: FilterQuery<CategoryGroupDoc> = {};

    let key: keyof CategoryGroup
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return COAGroupModel.find(realQuery).then((COAGroups: CategoryGroupDoc[]) =>
      COAGroups.map(COAGroup => new COAGroupEntity(COAGroup)),
    );
  }

  async batchFind(query: ObjectId[]){
    return COAGroupModel.find({ _id: { "$in" : query }})

  }
}
