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

  async addDocument(masterValue) {
    // console.log('masterValue at Repository', masterValue)
    const key = {
      CategoryId: masterValue.CategoryId,
      AttributeId: masterValue.AttributeId,
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
