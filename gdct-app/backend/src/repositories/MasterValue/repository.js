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
}
