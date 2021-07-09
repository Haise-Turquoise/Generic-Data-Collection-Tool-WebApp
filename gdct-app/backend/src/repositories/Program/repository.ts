import ProgramEntity from '../../entities/Program';
import BaseRepository from '../repository';
import ProgramModel from '../../models/Program';
import OrgModel from '../../models/Organization';
import TemplateTypeModel from '../../models/TemplateType';
import { ProgramDoc } from '../../types/program';
import { FilterQuery } from 'mongoose';

export default class ProgramRepository extends BaseRepository<ProgramDoc> {
  constructor() {
    super(ProgramModel);
  }

  async delete(id: string) {
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

  async create(program: ProgramDoc) {
    return ProgramModel.create(program);
  }

  async update(id: string, program: Partial<ProgramDoc>) {
    return ProgramModel.findByIdAndUpdate(id, program);
  }

  async find(query: FilterQuery<ProgramDoc>) {
    const realQuery: FilterQuery<ProgramDoc> = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }
    return ProgramModel.find(realQuery);
  }

  async findByIds(ids: string[]) {
    return ProgramModel.find({ _id: { $in: ids }, isActive: true });
  }

  async findById(id: string) {
    return ProgramModel.findById(id);
  }
}
