import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';
import MasterValue, { MasterValueDoc } from '../../types/mastervalue';
import { ObjectID } from 'mongodb';

export default class MasterValueRepository extends BaseRepository<MasterValue, MasterValueDoc> {
  constructor() {
    super(MasterValueModel);
  }

  // TODO test this one
  async bulkUpdate(submission: any, masterValues: MasterValueDoc[]) {
    return MasterValueModel.deleteMany({ submission }).then(() =>
      MasterValueModel.create(masterValues),
    );
  }

  async batchFind(attributeIds: string[], categoryIds: string[], orgId: number) {
    return MasterValueModel.find({ attributeId: { $in : attributeIds }, categoryId: {$in : categoryIds }, 'org.id':orgId}).then((values: unknown) => {return values});
  }

  async findAll(){
    return MasterValueModel.find();
  }
  
  async batchDelete(attributeIds: string[], categoryIds: string[], orgId: number) {
    return MasterValueModel.deleteMany({ attributeId: { $in : attributeIds }, categoryId: {$in : categoryIds }, org: orgId}).then((values: unknown) => {return values});
  }

  async findByCategoryId(id: string){
    return MasterValueModel.find({categoryId: id});
  }

  async findByAttributeId(id: string){
    return MasterValueModel.find({attributeId: id});
  }

  async findOneByProgramId(programId: string){
    return MasterValueModel.findOne({"program._id": new ObjectID(programId)}, {_id:1});
  }

  async findOneByReportingPeriodName(reportingPeriodName: string){
    // Please do not change the filter field, or the business rule might failed
    return MasterValueModel.findOne({reportingPeriod: reportingPeriodName},{_id: 1})
  }

  async addDocument(masterValue: MasterValueDoc) {
    // console.log('masterValue at Repository', masterValue)
    const key = {
      categoryId: masterValue.categoryId,
      attributeId: masterValue.attributeId,
      org: {
        id: masterValue.org.id,
        name: masterValue.org.name,
      },
      reportingPeriod: masterValue.reportingPeriod,
    };
    return MasterValueModel.findOne(key).then((res: MasterValueDoc | null) => {
      if (res) {
        // console.log('find the matched masterValue')
        return MasterValueModel.findByIdAndUpdate(res._id, masterValue);
      }
      // console.log('create a new data')
      return MasterValueModel.create(masterValue);
    });
  }

}

