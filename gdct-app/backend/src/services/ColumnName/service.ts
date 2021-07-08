import { FilterQuery } from 'mongoose';
import Container from 'typedi';
import ColumnNameRepository from '../../repositories/ColumnName';
import MasterValueRepository from '../../repositories/MasterValue';
import { AttributeDoc } from '../../types/attribute';

// @Service()
export default class ColumnNameService {
  private columnNameRepository: ColumnNameRepository;
  private masterValueRepository: MasterValueRepository;
  constructor() {
    this.columnNameRepository = Container.get(ColumnNameRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createColumnName(columnName: AttributeDoc) {
    return this.columnNameRepository.create(columnName);
  }

  async deleteColumnName(id: string) {
    let res = await this.columnNameRepository.findById(id);
    res = await this.masterValueRepository.findByAttributeId(res.id);
    if (!res.length) {
      return this.columnNameRepository.delete(id);
    } else {
      throw new Error("Attribute exists in mastervalue");
    }
  }

  async updateColumnName(id: string, columnName: Partial<AttributeDoc>) {
    return this.columnNameRepository.update(id, columnName);
  }

  async findColumnName(columnName: FilterQuery<AttributeDoc>) {
    return this.columnNameRepository.find(columnName);
  }

  async findById(id: string) {
    return this.columnNameRepository.findById(id);
  }
}
