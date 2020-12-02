import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';

export default class MasterValueRepository extends BaseRepository {
  constructor() {
    super(MasterValueModel);
  }

  async bulkUpdate(submissionId, masterValues) {
    return MasterValueModel.deleteMany({ submissionId }).then(() =>
      MasterValueModel.create(masterValues),
    );
  }

  async batchFind(attributeIds, categoryIds) {
    return MasterValueModel.find({ AttributeId: { $in : attributeIds }, categoryId: {$in : categoryIds }}).then(values => console.log(values));
  }

}
