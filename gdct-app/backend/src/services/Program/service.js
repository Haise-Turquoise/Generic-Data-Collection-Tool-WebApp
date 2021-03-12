import Container from 'typedi';

import ProgramRepository from '../../repositories/Program';
import MasterValueRepository from '../../repositories/MasterValue'

export default class ProgramService {
  constructor() {
    this.programRepository = Container.get(ProgramRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createProgram(program) {
    return this.programRepository.create(program);
  }

  async deleteProgram(id) {

    // Apply buisness rule, if program is referenced in mastervalue, throw an error to prevent deletion
    const masterValueEntry = await this.masterValueRepository.findOneByProgramId(id);
    if (masterValueEntry != null) throw new Error("This program is referenced in the master value table");

    return this.programRepository.delete(id);
  }

  async updateProgram(id, program) {
    return this.programRepository.update(id, program);
  }

  async findProgram(program) {
    return this.programRepository.find(program);
  }

  async findProgramByIds(ids) {
    return this.programRepository.findByIds(ids);
  }

  async findProgramById(id) {
    return this.programRepository.findById(id);
  }
}
