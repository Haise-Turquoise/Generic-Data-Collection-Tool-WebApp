import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';

export default class MasterValueRepository extends BaseRepository {
  constructor() {
    super(MasterValueModel);
  }

  async bulkUpdate(submissionId, masterValues) {
    return MasterValueModel.deleteMany({ submissionId }).then(() =>
      MasterValueModel.create(masterValues),
    );
  }

  /**
   *
   * @param {object} query
   */
  find(query = {}) {
    const realQuery = {};
    Object.keys(query).forEach(key => {
      if (query[key]) realQuery[key] = query[key];
    });
    return MasterValueModel.find(realQuery);
  }

  /**
   *
   * @param {string} id
   */
  findById(id) {
    return MasterValueModel.find({ id });
  }

  /**
   * @param {object} obj
   * @param {string} obj.organization
   * @param {string} obj.category
   * @param {string} obj.attribute
   */
  findByOrgColumnAttribute({ organization, category, attribute, templateType }) {
    if (templateType !== '') {
      return MasterValueModel.findOne({
        'org.id': organization,
        CategoryId: category,
        AttributeId: attribute,
        'templateType.name': templateType,
      });
    }
    return MasterValueModel.findOne({
      'org.id': organization,
      CategoryId: category,
      AttributeId: attribute,
    });
  }
}
