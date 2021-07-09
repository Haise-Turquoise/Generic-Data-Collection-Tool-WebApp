import Container from 'typedi';
import OrgRepository from '../../repositories/Organization';
import { OrganizationDoc } from '../../types/organization';


class OrgService {
  private OrgRepository: OrgRepository;

  constructor() {
    this.OrgRepository = Container.get(OrgRepository);
  }

  async createOrg(Org: OrganizationDoc) {
    return this.OrgRepository.create(Org);
  }

  async deleteOrg(id: string) {
    return this.OrgRepository.delete(id);
  }

  async updateOrg(id: string, Org: Partial<OrganizationDoc>) {
    return this.OrgRepository.update(id, Org);
  }

  async findOrg(Org: OrganizationDoc) {
    return this.OrgRepository.find(Org.toObject);
  }

  async findOrgByOrgGroupId(OrgGroupId: string) {
    return this.OrgRepository.findByOrgGroupId(OrgGroupId);
  }
  async findOrgById(Id: number) {
    return this.OrgRepository.findById(Id);
  }
}

export default OrgService;
