import COATreeEntity from '../../entities/COATree';
import BaseRepository from '../repository';
import COATreeModel from '../../models/COATree';
import CategoryTree, { CategoryTreeDoc } from '../../types/categorytree';
import {ObjectId} from 'mongodb';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';

export default class ReportPeriodRepository extends BaseRepository<CategoryTree, CategoryTreeDoc> {
  constructor() {
    super(COATreeModel);
  }

  async delete(id: string) {
    return COATreeModel.findByIdAndDelete(id).then(
      (COATree: CategoryTreeDoc|null) => {
        if (!COATree) throw new AppError(`Delete failed, Item not found for COATree item with ID: ${id}`);
        return new COATreeEntity(COATree)
      }
    );
  }

  async create(COATree: CategoryTree | CategoryTree[]) {
    return COATreeModel.create(COATree)
      .then(COATree => {
        if (Array.isArray(COATree)) {
          return COATree
        }
        return COATree.populate('categoryGroupId').execPopulate()
      })
      .then(COATree => {
        if (Array.isArray(COATree)) {
          return COATree.map(tree => new COATreeEntity(tree))
        }
        return new COATreeEntity(COATree)
      });
  }

  async update(id: string, COATree: Partial<CategoryTree>) {
    // @ts-ignore
    return COATreeModel.findByIdAndUpdate(id, COATree).then(
      (COATree: CategoryTreeDoc) => new COATreeEntity(COATree),
    );
  }

  async updateBySheet(sheetNameId: string, COATrees: CategoryTree[]) {
    return COATreeModel.deleteMany({
      sheetNameId,
    })
      .then(() => COATreeModel.create(COATrees))

      .then((COATrees: CategoryTreeDoc[]) => {
        return COATrees.map(COATree => new COATreeEntity(COATree));
      });
  }

  async find(query: Partial<CategoryTree>) {
    const realQuery: FilterQuery<CategoryTreeDoc> = {};
    let key: keyof CategoryTree
    for (key in query) {
      // @ts-ignore
      if (query[key]) realQuery[key] = query[key];
    }
    
    return COATreeModel.find(realQuery)
      .populate('categoryGroupId')
      .exec()
      .then((COATrees: CategoryTreeDoc[]) => {
        return COATrees.map(COATree => new COATreeEntity(COATree));
      });
  }

  async batchFindByCategoryIdWithoutSheetName(query: string[]) {
    const objIdQuery = query.map(q => new ObjectId(q))
    return COATreeModel.find({ categoryId: { $in: objIdQuery } });
  }

  async batchFindById(query: string[]) {
    return COATreeModel.find({ _id: { $in: query } });
  }
  async batchFindByCategoryId(query: string[], sheetTitleId: string):Promise<CategoryTreeDoc[]>{
    //@ts-ignore more problems with mongoose
    return COATreeModel.find({ categoryId: { "$in" : query }, sheetNameId: sheetTitleId})
  }
  
  async findOneByCategoryGroupId(groupId: string){
    const newId = new ObjectId(groupId)
    //@ts-ignore having trouble with these queries
    return COATreeModel.findOne({categoryGroupId : newId }, {_id:1})

  }
}
