import Container from 'typedi';
import OrgGroupRepository from '../../repositories/OrganizationGroup';

// @Service()
export default class OrganizationGroupService {
  private OrgGroupRepository: OrgGroupRepository;
  
  constructor() {
    this.OrgGroupRepository = Container.get(OrgGroupRepository);
  }

  async findAllOrgGroup() {
    return this.OrgGroupRepository.findAll();
  }
}
