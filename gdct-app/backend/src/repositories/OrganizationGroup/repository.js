import BaseRepository from '../repository';
import OrgGroupModel from '../../models/OrganizationGroup';

export default class OrgGroupRepository extends BaseRepository {
  constructor() {
    super(OrgGroupModel);
  }

  async findAll() {
    return OrgGroupModel.find();
  }
}
