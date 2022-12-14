import Container from 'typedi';
import OrgGroupRepository from '../../repositories/OrganizationGroup';
import OrganizationGroup from '../../types/organizationgroup';
// @Service()
export default class OrganizationGroupService {
  private orgGroupRepository: OrgGroupRepository;
  constructor() {
    this.orgGroupRepository = Container.get(OrgGroupRepository);
  }
  async createOrgGroup(orgGroup: OrganizationGroup) {
    return this.orgGroupRepository.create(orgGroup);
  }
  async deleteOrgGroup(id: string) {
    return this.orgGroupRepository.delete(id);
  }

  async updateOrgGroup(id: string, orgGroup: Partial<OrganizationGroup>) {
    return this.orgGroupRepository.update(id, orgGroup);
  }
  async findOrgGroup(Org: Partial<OrganizationGroup>) {
    return this.orgGroupRepository.find(Org);
  }
  async findOrgGroupById(Id: number) {
    return this.orgGroupRepository.findById(Id);
  }
  async findOrgGroupByIds(ids: string[]) {
    return this.orgGroupRepository.findByIds(ids);
  }
}
 