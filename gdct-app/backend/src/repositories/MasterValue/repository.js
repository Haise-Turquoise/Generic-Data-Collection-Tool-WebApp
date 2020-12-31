import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';

export default class MasterValueRepository extends BaseRepository {
  constructor() {
    super(MasterValueModel);
  }

  async bulkUpdate(submission, masterValues) {
    return MasterValueModel.deleteMany({ submission }).then(() =>
      MasterValueModel.create(masterValues),
    );
  }

  async batchFind(attributeIds, categoryIds) {
    return MasterValueModel.find({ attributeId: { $in : attributeIds }, categoryId: {$in : categoryIds }}).then(values => {return values});
  }

  async findAll(){
    return MasterValueModel.find();
  }
  
  async batchDelete(attributeIds, categoryIds, orgId) {
    return MasterValueModel.deleteMany({ AttributeId: { $in : attributeIds }, CategoryId: {$in : categoryIds }, org: orgId}).then(values => {return values});
  }

  async findByCategoryId(id){
    return MasterValueModel.find({categoryId: id})
  }

  async findByAttributeId(id){
    return MasterValueModel.find({attributeId: id})
  }
}