import COAGroupEntity from '../../entities/COAGroup';
import BaseRepository from '../repository';
import COAGroupModel from '../../models/COAGroup';
import CategoryGroup, { CategoryGroupDoc } from '../../types/categorygroup';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';
import AppError from '../../utils/AppError';

export default class COAGroupRepository extends BaseRepository<CategoryGroup, CategoryGroupDoc> {
  constructor() {
    super(COAGroupModel);
  }

  async delete(id: string) {
    return COAGroupModel.findByIdAndDelete(id).then(
      (COAGroup: CategoryGroupDoc|null) => {
        if (!COAGroup) throw new AppError(`Delete failed, Item not found for COA group item with ID: ${id}`);
        return new COAGroupEntity(COAGroup)
      }
    );
  }

  async create(COAGroup: CategoryGroup) {
    return COAGroupModel.create(COAGroup).then(COAGroup => new COAGroupEntity(COAGroup));
  }

  async update(id: string, COAGroup: Partial<CategoryGroup>) {
    return COAGroupModel.findByIdAndUpdate(id, COAGroup).then(
      (COAGroup: CategoryGroupDoc|null) =>{
        if (!COAGroup) throw new AppError(`Update failed, Item not found for COA group item with ID: ${id}, params:${COAGroup}`);
        return new COAGroupEntity(COAGroup)
      }
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
