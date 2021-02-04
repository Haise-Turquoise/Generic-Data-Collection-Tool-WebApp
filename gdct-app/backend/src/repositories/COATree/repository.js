import COATreeEntity from '../../entities/COATree';
import BaseRepository from '../repository';
import COATreeModel from '../../models/COATree';
import {ObjectId} from 'mongodb';

export default class ReportPeriodRepository extends BaseRepository {
  constructor() {
    super(COATreeModel);
  }

  async delete(id) {
    return COATreeModel.findByIdAndDelete(id).then(
      COATree => new COATreeEntity(COATree.toObject()),
    );
  }

  async create(COATree) {
    return COATreeModel.create(COATree)
      .then(COATree => COATree.populate('categoryGroupId').execPopulate())
      .then(COATree => new COATreeEntity(COATree.toObject()));
  }

  async update(id, COATree) {
    return COATreeModel.findByIdAndUpdate(id, COATree).then(
      COATree => new COATreeEntity(COATree.toObject()),
    );
  }

  async updateBySheet(sheetNameId, COATrees) {
    return COATreeModel.deleteMany({
      sheetNameId,
    })
      .then(() => COATreeModel.create(COATrees))

      .then(COATrees => {
        return COATrees.map(COATree => new COATreeEntity(COATree.toObject()));
      });
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return COATreeModel.find(realQuery)
      .populate('categoryGroupId')
      .exec()
      .then(COATrees => {
        return COATrees.map(COATree => new COATreeEntity(COATree.toObject()));
      });
  }

  async batchFindByCategoryId(query, sheetTitleId){
    return COATreeModel.find({ categoryId: { "$in" : query }, sheetNameId: sheetTitleId})
  }

  async batchFindById(query){
    return COATreeModel.find({ _id: { "$in" : query }})
  }

  async findOneByCategoryGroupId(groupId){
    return COATreeModel.findOne({categoryGroupId:new ObjectId(groupId)}, {_id:1})
  }
}
