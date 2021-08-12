import ColumnNameEntity from '../../entities/ColumnName/ColumnName';
import BaseRepository from '../repository';
import ColumnNameModel from '../../models/ColumnName';
import Attribute, { AttributeDoc } from '../../types/attribute';
import { FilterQuery, QueryOptions } from 'mongoose';
import AppError from '../../utils/AppError';

export default class ColumnNameRepository extends BaseRepository<Attribute, AttributeDoc> {
  constructor() {
    super(ColumnNameModel);
  }

  async delete(id: string) {
    return ColumnNameModel.findByIdAndDelete(id).then(
      (deletedColumnName: AttributeDoc|null) => {
        if (!deletedColumnName) throw new AppError(`Delete failed, Item not found for ColumnName item with ID: ${id}`);
        return new ColumnNameEntity(deletedColumnName)
      },
    );
  }

  async create(columnName: Attribute) {
    return ColumnNameModel.create(columnName).then(
      createdColumnName => new ColumnNameEntity(createdColumnName),
    );
  }

  async update(id: string, columnName: Partial<Attribute>) {
    return ColumnNameModel.findByIdAndUpdate(id, columnName).then(
      (updatedColumnName: AttributeDoc|null) => {
        if (!updatedColumnName) throw new AppError(`Update failed, Item not found for ColumnName item with ID: ${id}`);
        return new ColumnNameEntity(updatedColumnName)
      },
    );
  }

  //should be Partial<AttributeDoc> but ts is not a fan
  async find(query: Partial<Attribute>) {
    const realQuery: FilterQuery<AttributeDoc> = {};

    let key: keyof Attribute
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return ColumnNameModel.find(realQuery).then((fetchedColumnNames: AttributeDoc[]) =>
      fetchedColumnNames.map(
        fetchedColumnName => new ColumnNameEntity(fetchedColumnName),
      ),
    );
  }

  async batchFind(attributeIds: string[], option={ name: 0, _id: 0, __v: 0}):Promise<AttributeDoc[]> {
    return ColumnNameModel.find({ id: { $in : attributeIds }}, option).then((values: AttributeDoc[]) => {return values});
  }

  async findAll(option?: QueryOptions):Promise<AttributeDoc[]> {
    return ColumnNameModel.find({}, option);
  }

  async findAllColumnId() {
    return ColumnNameModel.find({}).then((fetchedColumnNames: AttributeDoc[]) =>
      fetchedColumnNames.map(
        fetchedColumnName => fetchedColumnName.id
      ),
    );
  }

  async findById(id: string):Promise<ColumnNameEntity|undefined> {
    return ColumnNameModel.find({ _id: id })
    .then((result: AttributeDoc[]|undefined) => {
      if (!result) throw new AppError(`Query failed, Item not found for Column Name item with ID: ${id}`)
      if (result.length == 0) {
        return ;
      }
      else {
        return new ColumnNameEntity(result[0]);
      }
    })
  }
}
