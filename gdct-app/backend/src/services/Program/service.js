import Container from 'typedi';

import ProgramRepository from '../../repositories/Program';

export default class ProgramService {
  constructor() {
    this.programRepository = Container.get(ProgramRepository);
  }

  async createProgram(program) {
    return this.programRepository.create(program);
  }

  async deleteProgram(id) {
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
}
