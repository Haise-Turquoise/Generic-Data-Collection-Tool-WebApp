import Container from 'typedi';

import ProgramRepository from '../../repositories/Program';
import MasterValueRepository from '../../repositories/MasterValue'
import Program from '../../types/program';

export default class ProgramService {
  private programRepository: ProgramRepository;
  private masterValueRepository: MasterValueRepository;

  constructor() {
    this.programRepository = Container.get(ProgramRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createProgram(program: Program) {
    console.log("hit1")
    return this.programRepository.create(program);
  }

  async deleteProgram(id: string) {

    // Apply buisness rule, if program is referenced in mastervalue, throw an error to prevent deletion
    const masterValueEntry = await this.masterValueRepository.findOneByProgramId(id);
    if (masterValueEntry != null) throw new Error("This program is referenced in the master value table");

    const orgEntry = await this.programRepository.findOrgByProgramID(id);
    const templateTypeModelEntry = await this.programRepository.findTemplateTypeModelByProgramID(id);
    console.log(templateTypeModelEntry);
    if (orgEntry.length > 0 || templateTypeModelEntry.length > 0 ) {
      return false;
    }

    return this.programRepository.delete(id);
  }

  async updateProgram(id: string, program: Partial<Program>) {
    return this.programRepository.update(id, program);
  }

  async findProgram(program: Partial<Program>) {
    return this.programRepository.find(program);
  }

  async findProgramByIds(ids: string[]) {
    return this.programRepository.findByIds(ids);
  }

  async findProgramById(id: string) {
    return this.programRepository.findById(id);
  }
}
