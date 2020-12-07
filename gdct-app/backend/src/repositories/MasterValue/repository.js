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
    return MasterValueModel.find({ AttributeId: { $in : attributeIds }, CategoryId: {$in : categoryIds }}).then(values => {return values});
  }

  async batchDelete(attributeIds, categoryIds, orgId) {
    return MasterValueModel.deleteMany({ AttributeId: { $in : attributeIds }, CategoryId: {$in : categoryIds }, org: orgId}).then(values => {return values});
  }
}