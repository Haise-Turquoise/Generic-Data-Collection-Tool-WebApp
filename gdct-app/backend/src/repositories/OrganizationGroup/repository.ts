import BaseRepository from '../repository';
import OrgGroupModel from '../../models/OrganizationGroup';
import { OrganizationGroupDoc } from '../../types/organizationgroup';

export default class OrgGroupRepository extends BaseRepository<OrganizationGroupDoc> {
  constructor() {
    super(OrgGroupModel);
  }

  async findAll() {
    return OrgGroupModel.find();
  }
}
