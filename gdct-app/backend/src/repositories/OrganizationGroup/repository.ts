import OrgGroupEntity from '../../entities/OrganizationGroup';
import BaseRepository from '../repository';
import OrgGroupModel from '../../models/OrganizationGroup';
import OrgModel from '../../models/Organization';
import OrganizationGroup, { OrganizationGroupDoc } from '../../types/organizationgroup';
import {dateStringTranslate} from '../../utils/misc';
import { FilterQuery, ObjectId } from 'mongoose';

export default class OrgGroupRepository extends BaseRepository<OrganizationGroup, OrganizationGroupDoc> {
  constructor() {
    super(OrgGroupModel);
  } 

  async delete(id: string) {
    const mongoose = require('mongoose');
    const temp = mongoose.Types.ObjectId(id);
    console.log('delete organizationgroup');
    // OrgModel.find({ OrgId: temp }, function (err, program1) {
    //   OrgModel.find({ programId: temp }, function (err, program2) {
    //     if (program1.length > 0 || program2.length > 0) {
    //       console.log(program2); 
    //       return program2;
    //     }
    //     return OrgGroupModel.findByIdAndDelete(id).then(() => {});
    //   });
    // });
  }

  async create(organizationgroup: OrganizationGroup) {
    console.log(organizationgroup.updatedAt + 'llllllllll');
    organizationgroup.updatedAt = dateStringTranslate(new Date(organizationgroup.updatedAt))
    return OrgGroupModel.create(organizationgroup);
  }

  async update(id: string, organizationgroup: Partial<OrganizationGroup>) {
    organizationgroup.updatedAt = dateStringTranslate(new Date(organizationgroup.updatedAt))
    return OrgGroupModel.findByIdAndUpdate(id, organizationgroup);
  }

  async find(query: Partial<OrganizationGroup>) {
    const realQuery: FilterQuery<OrganizationGroupDoc> = {};

    let key: keyof OrganizationGroup
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
      
    }
    console.log(query);
    console.log('line 47.........');
    return OrgGroupModel.find(realQuery);
  }

  async findByIds(ids: string[]) {
    return OrgGroupModel.find({ _id: { $in: ids }, isActive: true });
  }

  async findById(id: number) {
    return OrgGroupModel.findById(id);
  }
}
