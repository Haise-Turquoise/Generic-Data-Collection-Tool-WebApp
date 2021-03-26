import Container from 'typedi';
import ColumnNameRepository from '../../repositories/ColumnName';
import MasterValueRepository from '../../repositories/MasterValue';

// @Service()
export default class ColumnNameService {
  constructor() {
    this.columnNameRepository = Container.get(ColumnNameRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createColumnName(columnName) {
    return this.columnNameRepository.create(columnName);
  }

  async deleteColumnName(id) {
    let res = await this.columnNameRepository.findById(id);
    res = await this.masterValueRepository.findByAttributeId(res.id);
    if (!res.length) {
      return this.columnNameRepository.delete(id);
    } else {
      throw new Error("Attribute exists in mastervalue");
    }
  }

  async updateColumnName(id, columnName) {
    return this.columnNameRepository.update(id, columnName);
  }

  async findColumnName(columnName) {
    return this.columnNameRepository.find(columnName);
  }

  async findById(id) {
    return this.columnNameRepository.findById(id);
  }
}
