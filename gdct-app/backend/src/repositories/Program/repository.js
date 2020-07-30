import ProgramEntity from '../../entities/Program';
import BaseRepository from '../repository';
import ProgramModel from '../../models/Program';

import OrgModel from '../../models/Organization';

import TemplateTypeModel from '../../models/TemplateType';

export default class ProgramRepository extends BaseRepository {
  constructor() {
    super(ProgramModel);
  }

  async delete(id) {
    const mongoose = require('mongoose');
    const temp = mongoose.Types.ObjectId(id);

    OrgModel.find({ programId: temp }, function (err, program1) {
      TemplateTypeModel.find({ programId: temp }, function (err, program2) {
        if (program1.length > 0 || program2.length > 0) {
          return ProgramModel;
        }
        return ProgramModel.findByIdAndDelete(id).then(() => {});
      });
    });
  }

  async create(program) {
    return ProgramModel.create(program);
  }

  async update(id, program) {
    return ProgramModel.findByIdAndUpdate(id, program);
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return ProgramModel.find(realQuery);
  }

  async findByIds(ids) {
    return ProgramModel.find({ _id: { $in: ids }, isActive: true });
  }

  async findById(id) {
    return ProgramModel.findById(id);
  }
}
