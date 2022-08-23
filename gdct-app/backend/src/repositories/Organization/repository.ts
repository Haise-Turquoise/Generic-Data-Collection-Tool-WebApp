import BaseRepository from '../repository';
import OrgModel from '../../models/Organization';
import OrgEntity from '../../entities/Organization';
import Organization, { OrganizationDoc } from '../../types/organization';
import {dateStringTranslate} from '../../utils/misc';
import { FilterQuery } from 'mongoose';
import AppError from '../../utils/AppError';

export default class OrgRepository extends BaseRepository<Organization, OrganizationDoc> {
  constructor() {
    super(OrgModel);
  }

  async delete(id: string) {
    return OrgModel.findByIdAndDelete(id)
    .then((Org: OrganizationDoc|null) => {
      if (!Org) throw new AppError(`Delete failed, Item not found for Org item with ID: ${id}`);
      return new OrgEntity(Org);
    });
  }

  async create(Org: Organization) {
    Org.updatedAt = dateStringTranslate(new Date(Org.updatedAt))
    Org.effectiveDate = dateStringTranslate(new Date(Org.effectiveDate))
    return OrgModel.create(Org).then(Org => new OrgModel(Org));
  }

  async update(id: string, Org: Partial<Organization>) {
    
    Org.updatedAt = dateStringTranslate(new Date(Org.updatedAt!))
    Org.effectiveDate = dateStringTranslate(new Date(Org.effectiveDate))
    return OrgModel.findByIdAndUpdate(id, Org, { new: true })
    .then((org: OrganizationDoc|null) => {
      if (!org) throw new AppError(`Update failed, Item not found for Org item with ID: ${id}`);
      return new OrgEntity(org);
    });
  }

  async find(query: Partial<Organization>) {
    const realQuery: FilterQuery<OrganizationDoc> = {};
    let key: keyof Organization
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return OrgModel.find(realQuery).then((Orgs: OrganizationDoc[]) => Orgs.map(Org => new OrgEntity(Org)));
  }

  async findByOrgGroupId(orgGroupId: string) {
    // casting needed to match correct overload
    return OrgModel.find({ organizationGroupId: orgGroupId } as FilterQuery<OrganizationDoc>);
  }

  async findById(id: number) {
    return OrgModel.findOne({ id });
  }
}
