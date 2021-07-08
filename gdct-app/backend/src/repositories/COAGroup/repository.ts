import COAGroupEntity from '../../entities/COAGroup';
import BaseRepository from '../repository';
import COAGroupModel from '../../models/COAGroup';
import { CategoryGroupDoc } from '../../types/categorygroup';
import { FilterQuery } from 'mongoose';

export default class COAGroupRepository extends BaseRepository<CategoryGroupDoc> {
  constructor() {
    super(COAGroupModel);
  }
  async delete(id: string) {
    return COAGroupModel.findByIdAndDelete(id).then(
      (COAGroup: CategoryGroupDoc) => new COAGroupEntity(COAGroup),
    );
  }

  async create(COAGroup: CategoryGroupDoc) {
    return COAGroupModel.create(COAGroup).then(COAGroup => new COAGroupEntity(COAGroup));
  }

  async update(id: string, COAGroup: Partial<CategoryGroupDoc>) {
    return COAGroupModel.findByIdAndUpdate(id, COAGroup).then(
      (COAGroup: CategoryGroupDoc) => new COAGroupEntity(COAGroup),
    );
  }

  async find(query: FilterQuery<CategoryGroupDoc>) {
    const realQuery: FilterQuery<CategoryGroupDoc> = {};

    let key: keyof FilterQuery<CategoryGroupDoc>
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return COAGroupModel.find(realQuery).then((COAGroups: CategoryGroupDoc[]) =>
      COAGroups.map(COAGroup => new COAGroupEntity(COAGroup)),
    );
  }

  // TODO ask about this one
  async batchFind(query: any){
    return COAGroupModel.find({ _id: { "$in" : query }})

  }
}
