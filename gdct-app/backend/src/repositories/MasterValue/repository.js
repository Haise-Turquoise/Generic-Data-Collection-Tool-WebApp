import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';
import { log } from '../../utils/log/winston';

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
      return MasterValueModel.find(
        {
          'org.id': organization,
          CategoryId: category,
          AttributeId: attribute,
          'templateType.name': templateType,
        },
        {
          value: 1,
        },
      );
    }
    log.info(
      `action to read masterValue data with ${JSON.stringify({
        organization,
        category,
        attribute,
      })}`,
    );
    return MasterValueModel.find(
      {
        'org.id': organization,
        CategoryId: category,
        AttributeId: attribute,
      },
      {
        value: 1,
      },
    );
  }
}
