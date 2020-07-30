import BaseRepository from '../repository';
import OrgModel from '../../models/Organization';
import OrgEntity from '../../entities/Organization';

export default class OrgRepository extends BaseRepository {
  constructor() {
    super(OrgModel);
  }

  async delete(id) {
    return OrgModel.findByIdAndDelete(id).then(Org => new OrgEntity(Org.toObject()));
  }

  async create(Org) {
    return OrgModel.create(Org).then(Org => new OrgModel(Org.toObject()));
  }

  async update(id, { Org }) {
    return OrgModel.findByIdAndUpdate(id, Org, { new: true }).then(
      org => new OrgEntity(org.toObject()),
    );
  }

  async find(query) {
    const realQuery = {};
    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return OrgModel.find({}).then(Orgs => Orgs.map(Org => new OrgEntity(Org.toObject())));
  }

  async findByOrgGroupId(orgGroupId) {
    return OrgModel.find({ organizationGroupId: orgGroupId });
  }

  async findById(id) {
    return OrgModel.find({ id });
  }
}
