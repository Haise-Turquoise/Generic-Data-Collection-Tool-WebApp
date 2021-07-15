import BaseRepository from '../repository';
import OrgModel from '../../models/Organization';
import OrgEntity from '../../entities/Organization';
import Organization, { OrganizationDoc } from '../../types/organization';
import { FilterQuery } from 'mongoose';

export default class OrgRepository extends BaseRepository<Organization, OrganizationDoc> {
  constructor() {
    super(OrgModel);
  }

  async delete(id: string) {
    return OrgModel.findByIdAndDelete(id).then((Org: OrganizationDoc) => new OrgEntity(Org));
  }

  async create(Org: Organization) {
    return OrgModel.create(Org).then(Org => new OrgModel(Org));
  }

  async update(id: string, Org: Partial<Organization>) {
    return OrgModel.findByIdAndUpdate(id, Org, { new: true }).then(
      (org: OrganizationDoc) => new OrgEntity(org),
    );
  }

  async find(query: Partial<Organization>) {
    const realQuery: FilterQuery<OrganizationDoc> = {};
    let key: keyof Organization
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return OrgModel.find({}).then((Orgs: OrganizationDoc[]) => Orgs.map(Org => new OrgEntity(Org)));
  }

  async findByOrgGroupId(orgGroupId: string) {
    // casting needed to match correct overload
    return OrgModel.find({ organizationGroupId: orgGroupId } as FilterQuery<OrganizationDoc>);
  }

  async findById(id: number) {
    return OrgModel.findOne({ id });
  }
}
