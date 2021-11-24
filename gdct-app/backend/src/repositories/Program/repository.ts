import ProgramEntity from '../../entities/Program';
import BaseRepository from '../repository';
import ProgramModel from '../../models/Program';
import OrgModel from '../../models/Organization';
import TemplateTypeModel from '../../models/TemplateType';
import Program, { ProgramDoc } from '../../types/program';
import { FilterQuery, ObjectId } from 'mongoose';

export default class ProgramRepository extends BaseRepository<Program, ProgramDoc> {
  constructor() {
    super(ProgramModel);
  }

  async delete(id: string) {
    const mongoose = require('mongoose');
    const temp = mongoose.Types.ObjectId(id);

    OrgModel.find({ programId: temp }, function (err, program1) {
      TemplateTypeModel.find({ programId: temp }, function (err, program2) {
        if (program1.length > 0 || program2.length > 0) {
          console.log(program2); 
          return program2;
        }
        return ProgramModel.findByIdAndDelete(id).then(() => {});
      });
    });
  }


  async findOrgByProgramID(id:string){
    const mongoose = require('mongoose');
    const temp = mongoose.Types.ObjectId(id);
    return OrgModel.find({ programId: temp });
  }
  async findTemplateTypeModelByProgramID(id:string){
    const mongoose = require('mongoose');
    const temp = mongoose.Types.ObjectId(id);
    return TemplateTypeModel.find({ programIds: temp });
  }

  async create(program: Program) {
    return ProgramModel.create(program);
  }

  async update(id: string, program: Partial<Program>) {
    return ProgramModel.findByIdAndUpdate(id, program);
  }

  async find(query: Partial<Program>) {
    const realQuery: FilterQuery<ProgramDoc> = {};

    let key: keyof Program
    for (key in query) {
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
