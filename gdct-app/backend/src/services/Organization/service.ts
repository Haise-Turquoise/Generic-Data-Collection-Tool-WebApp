import Container from 'typedi';
import OrgRepository from '../../repositories/Organization';
import Organization from '../../types/organization';


class OrgService {
  private OrgRepository: OrgRepository;

  constructor() {
    this.OrgRepository = Container.get(OrgRepository);
  }

  async createOrg(Org: Organization) {
    return this.OrgRepository.create(Org);
  }

  async deleteOrg(id: string) {
    return this.OrgRepository.delete(id);
  }

  async updateOrg(id: string, Org: Partial<Organization>) {
    return this.OrgRepository.update(id, Org);
  }

  async findOrg(Org: Partial<Organization>) {
    return this.OrgRepository.find(Org);
  }

  async findOrgByOrgGroupId(OrgGroupId: string) {
    return this.OrgRepository.findByOrgGroupId(OrgGroupId);
  }
  async findOrgById(Id: number) {
    return this.OrgRepository.findById(Id);
  }
}

export default OrgService;
