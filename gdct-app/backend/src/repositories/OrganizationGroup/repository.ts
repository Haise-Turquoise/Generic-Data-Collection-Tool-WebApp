import BaseRepository from '../repository';
import OrgGroupModel from '../../models/OrganizationGroup';
import OrganizationGroup, { OrganizationGroupDoc } from '../../types/organizationgroup';

export default class OrgGroupRepository extends BaseRepository<OrganizationGroup, OrganizationGroupDoc> {
  constructor() {
    super(OrgGroupModel);
  }

  async findAll() {
    return OrgGroupModel.find();
  }
}
