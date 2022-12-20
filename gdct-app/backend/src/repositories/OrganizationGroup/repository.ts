import OrgGroupEntity from '../../entities/OrganizationGroup';
import BaseRepository from '../repository';
import OrgGroupModel from '../../models/OrganizationGroup';
import OrgModel from '../../models/Organization';
import OrganizationGroup, { OrganizationGroupDoc } from '../../types/organizationgroup';
import { FilterQuery, ObjectId } from 'mongoose';

export default class OrgGroupRepository extends BaseRepository<OrganizationGroup, OrganizationGroupDoc> {
  constructor() {
    super(OrgGroupModel);
  } 

  async delete(id: string) {
    const mongoose = require('mongoose');
    const temp = mongoose.Types.ObjectId(id);
    OrgGroupModel.find({ OrgGroupId: temp }, async function (err, orgGroup1) {
      OrgModel.find({ OrgId: temp }, function (err, orgGroup2) {
        if (orgGroup1.length > 0 || orgGroup2.length > 0) {
          return orgGroup2;
        }
        return OrgGroupModel.findByIdAndDelete(id).then(() => {});
      });
    });
  }

  async create(organizationgroup: OrganizationGroup) {
    return OrgGroupModel.create(organizationgroup);
  }

  async update(id: string, organizationgroup: Partial<OrganizationGroup>) {
    return OrgGroupModel.findByIdAndUpdate(id, organizationgroup);
  }

  async find(query: Partial<OrganizationGroup>) {
    const realQuery: FilterQuery<OrganizationGroupDoc> = {};

    let key: keyof OrganizationGroup
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return OrgGroupModel.find(realQuery);
  }

  async findByIds(ids: string[]) {
    return OrgGroupModel.find({ _id: { $in: ids }, isActive: true });
  }

  async findById(id: number) {
    return OrgGroupModel.findById(id);
  }
}
