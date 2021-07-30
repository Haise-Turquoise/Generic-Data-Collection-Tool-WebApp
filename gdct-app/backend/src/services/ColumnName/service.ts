import { FilterQuery } from 'mongoose';
import Container from 'typedi';
import ColumnNameRepository from '../../repositories/ColumnName';
import MasterValueRepository from '../../repositories/MasterValue';
import Attribute from '../../types/attribute';
import AppError from '../../utils/AppError';

// @Service()
export default class ColumnNameService {
  private columnNameRepository: ColumnNameRepository;
  private masterValueRepository: MasterValueRepository;
  constructor() {
    this.columnNameRepository = Container.get(ColumnNameRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createColumnName(columnName: Attribute) {
    return this.columnNameRepository.create(columnName);
  }

  async deleteColumnName(id: string) {
    const res = await this.columnNameRepository.findById(id);
    if (!res) throw new AppError(`Delete Failed, cannot find column name by Id: ${id}`)
    const res2 = await this.masterValueRepository.findByAttributeId(res.id);

    if (!res2.length) {
      return this.columnNameRepository.delete(id);
    } else {
      throw new Error("Attribute exists in mastervalue");
    }
  }

  async updateColumnName(id: string, columnName: Partial<Attribute>) {
    return this.columnNameRepository.update(id, columnName);
  }

  async findColumnName(columnName: Partial<Attribute>) {
    return this.columnNameRepository.find(columnName);
  }

  async findById(id: string) {
    return this.columnNameRepository.findById(id);
  }
}
