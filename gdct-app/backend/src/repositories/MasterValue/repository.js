import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';
import { ObjectID } from 'mongodb';

export default class MasterValueRepository extends BaseRepository {
  constructor() {
    super(MasterValueModel);
  }

  async bulkUpdate(submission, masterValues) {
    return MasterValueModel.deleteMany({ submission }).then(() =>
      MasterValueModel.create(masterValues),
    );
  }

  async batchFind(attributeIds, categoryIds, orgId) {
    return MasterValueModel.find({ AttributeId: { $in : attributeIds }, CategoryId: {$in : categoryIds }, 'org.id':orgId}).then(values => {return values});
  }

  async findAll(){
    return MasterValueModel.find();
  }
  
  async batchDelete(attributeIds, categoryIds, orgId) {
    return MasterValueModel.deleteMany({ AttributeId: { $in : attributeIds }, CategoryId: {$in : categoryIds }, org: orgId}).then(values => {return values});
  }

  async findByCategoryId(id){
    return MasterValueModel.find({categoryId: id});
  }

  async findByAttributeId(id){
    return MasterValueModel.find({attributeId: id});
  }

  async findOneByProgramId(programId){
    return MasterValueModel.findOne({"program._id": new ObjectID(programId)}, {_id:1});
  }

  async findOneByReportingPeriodName(reportingPeriodName){
    // Please do not change the filter field, or the business rule might failed
    return MasterValueModel.findOne({reportingPeriod: reportingPeriodName},{_id: 1})
  }

  async addDocument(masterValue) {
    // console.log('masterValue at Repository', masterValue)
    const key = {
      categoryId: masterValue.categoryId,
      attributeId: masterValue.attributeId,
      org: {
        id: masterValue.org.id,
        name: masterValue.org.name,
      },
    };
    return MasterValueModel.findOne(key).then(res => {
      if (res) {
        // console.log('find the matched masterValue')
        return MasterValueModel.findByIdAndUpdate(res._id, masterValue);
      }
      // console.log('create a new data')
      return MasterValueModel.create(masterValue);
    });
  }

}

