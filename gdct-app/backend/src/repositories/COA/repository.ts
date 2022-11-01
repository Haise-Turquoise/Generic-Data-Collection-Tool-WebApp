import COAEntity from '../../entities/COA';
import BaseRepository from '../repository';
import COAModel from '../../models/COA';
import Category, { CategoryDoc } from '../../types/category';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';

export default class COARepository extends BaseRepository<Category, CategoryDoc> {
  constructor() {
    super(COAModel);
  }

  async delete(id: string) {
    return COAModel.findByIdAndDelete(id).then((COA: CategoryDoc | null) => {
      if (!COA) return undefined;
      return new COAEntity(COA)
    });
  }

  async create(COA: Category | Category[]) {
    return COAModel.create(COA).then(COA => {
      if (Array.isArray(COA)) {
        // handles adding multiple COA objects
        return COA.map(category => new COAEntity(category))
      }
      return new COAEntity(COA)
    });
  }

  async update(id: string, COA: Partial<Category>) {
    return COAModel.findByIdAndUpdate(id, COA).then((COA: CategoryDoc | null) => {
      if (!COA) throw new AppError(`Update failed, Item not found or not updated for COA item with ID: ${id}, params:${COA}`);
      return new COAEntity(COA)
    });
  }

  async find(query: Partial<Category>) {
    const realQuery: FilterQuery<CategoryDoc> = {};
    let key: keyof Category
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return COAModel.find({}).then((COAs: CategoryDoc[]) => COAs.map(COA => new COAEntity(COA)));
  }

  async batchFind(categoryIds: string[], option = { name: 0, _id: 0, COA: 0, __v: 0, unitOfMeassure: 0 }): Promise<CategoryDoc[]> {
    return COAModel.find({ id: { $in: categoryIds } }, option);
  }

  async batchFindFull(query: string[]) {
    return COAModel.find({ id: { $in: query } });
  }

  async findById(id: string): Promise<COAEntity | undefined> {
    return COAModel.find({ _id: id }).then((result: CategoryDoc[] | undefined) => {
      if (!result) throw new AppError(`Query failed, Item not found for COA item with ID: ${id}`)
      if (result.length == 0) {
        return;
      }
      else {
        return new COAEntity(result[0]);
      }
    });
  }

  async updateMapping(id: string, COAMap: string) {
    return COAModel.findOneAndUpdate({"id": id}, {"COA": COAMap});
  }
}
