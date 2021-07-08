import COATreeEntity from '../../entities/COATree';
import BaseRepository from '../repository';
import COATreeModel from '../../models/COATree';
import { CategoryTreeDoc } from '../../types/categorytree';
import {ObjectId} from 'mongodb';
import { FilterQuery } from 'mongoose';

export default class ReportPeriodRepository extends BaseRepository<CategoryTreeDoc> {
  constructor() {
    super(COATreeModel);
  }

  async delete(id: string) {
    return COATreeModel.findByIdAndDelete(id).then(
      (COATree: CategoryTreeDoc) => new COATreeEntity(COATree),
    );
  }

  async create(COATree: CategoryTreeDoc) {
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
        new COATreeEntity(COATree)
      });
  }

  async update(id: string, COATree: Partial<CategoryTreeDoc>) {
    return COATreeModel.findByIdAndUpdate(id, COATree).then(
      (COATree: CategoryTreeDoc) => new COATreeEntity(COATree),
    );
  }

  async updateBySheet(sheetNameId: string, COATrees: CategoryTreeDoc[]) {
    return COATreeModel.deleteMany({
      sheetNameId,
    })
      .then(() => COATreeModel.create(COATrees))

      .then((COATrees: CategoryTreeDoc[]) => {
        return COATrees.map(COATree => new COATreeEntity(COATree));
      });
  }

  async find(query: Partial<CategoryTreeDoc>) {
    const realQuery: FilterQuery<CategoryTreeDoc> = {};
    let key: keyof CategoryTreeDoc
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    
    return COATreeModel.find(realQuery)
      .populate('categoryGroupId')
      .exec()
      .then((COATrees: CategoryTreeDoc[]) => {
        return COATrees.map(COATree => new COATreeEntity(COATree));
      });
  }

  // TODO unsure about this one
  async batchFindByCategoryIdWithoutSheetName(query: string[]) {
    return COATreeModel.find({ categoryId: { $in: query } });
  }

  async batchFindById(query: string[]) {
    return COATreeModel.find({ _id: { $in: query } });
  }
  async batchFindByCategoryId(query: string[], sheetTitleId: string){
    //@ts-ignore more problems with mongoose
    return COATreeModel.find({ categoryId: { "$in" : query }, sheetNameId: sheetTitleId})
  }
  
  async findOneByCategoryGroupId(groupId: string){
    const newId = new ObjectId(groupId)
    //@ts-ignore having trouble with these queries
    return COATreeModel.findOne({categoryGroupId : newId }, {_id:1})

  }
}
