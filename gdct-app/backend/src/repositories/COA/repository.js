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
  
  // Last Updated: Nov 27, 2020
  // Used to find COAs through their ID
  async findByIDNumber(query){
    return COAModel.find(query);
  }

  async findAllCoaId(query) {
    return COAModel.find({}).then(COAs => COAs.map(COA => parseInt(COA.id)));
  }

  async batchFind(categoryIds, option={ name: 0, _id: 0, COA: 0, __v: 0, unitOfMeassure: 0}) {
    return COAModel.find({ id: { $in : categoryIds }}, option);
  }

  async batchFindFull(query){
    return COAModel.find({ id: { $in : query }});
  }

  // async findById(id) {
  //   return COAModel.find({ id }).then((result)=>{
      
  //     if (result.length == 0){
  //       return [];
  //     }
  //     else {
  //       return new COAEntity(result[0]);
        
  //     }
  //   });
  // }
}
