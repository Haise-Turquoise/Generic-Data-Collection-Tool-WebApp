import COAEntity from '../../entities/COA';
import BaseRepository from '../repository';
import COAModel from '../../models/COA';
import Category, { CategoryDoc } from '../../types/category';
import { FilterQuery } from 'mongoose';

export default class COARepository extends BaseRepository<Category, CategoryDoc> {
  constructor() {
    super(COAModel);
  }

  async delete(id: string) {
    return COAModel.findByIdAndDelete(id).then((COA: CategoryDoc) => new COAEntity(COA));
  }

  async create(COA: Category | Category[]) {
    return COAModel.create(COA).then(COA => {
      if (Array.isArray(COA)) {
        // handles adding multiple COA objects
        //TODO TEST THIS PLES JULIEN
        return COA.map(category => new COAEntity(category))
      }
      return new COAEntity(COA)
    });
  }

  async update(id: string, COA: Partial<Category>) {
    return COAModel.findByIdAndUpdate(id, COA).then((COA: CategoryDoc) => new COAEntity(COA));
  }

  async find(query: Partial<Category>) {
    const realQuery: FilterQuery<CategoryDoc> = {};
    let key: keyof Category
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return COAModel.find({}).then((COAs: CategoryDoc[]) => COAs.map(COA => new COAEntity(COA)));
  }
  
  // Last Updated: Nov 27, 2020
  // Used to find COAs through their ID
  // TODO ask about what this should be
  async findByIDNumber(query: any){
    return COAModel.find(query);
  }

  // TODO same with this
  async findAllCoaId(query: any) {
    return COAModel.find({}).then((COAs: CategoryDoc[]) => COAs.map(COA => parseInt(COA.id)));
  }

  async batchFind(categoryIds: string[], option={ name: 0, _id: 0, COA: 0, __v: 0, unitOfMeassure: 0}) {
    return COAModel.find({ id: { $in : categoryIds }}, option);
  }

  // TODO this one too
  async batchFindFull(query: any[]){
    return COAModel.find({ id: { $in : query }});
  }

  async findById(id: string) {
    return COAModel.find({ _id: id }).then((result: CategoryDoc[])=>{
      if (result.length == 0){
        return [];
      }
      else {
        return new COAEntity(result[0]);
      }
    });
  }
}
