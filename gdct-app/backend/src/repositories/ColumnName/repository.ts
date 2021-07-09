import ColumnNameEntity from '../../entities/ColumnName/ColumnName';
import BaseRepository from '../repository';
import ColumnNameModel from '../../models/ColumnName';
import Attribute, { AttributeDoc } from '../../types/attribute';
import { FilterQuery, QueryOptions } from 'mongoose';

export default class ColumnNameRepository extends BaseRepository<Attribute, AttributeDoc> {
  constructor() {
    super(ColumnNameModel);
  }

  async delete(id: string) {
    return ColumnNameModel.findByIdAndDelete(id).then(
      (deletedColumnName: AttributeDoc) => new ColumnNameEntity(deletedColumnName),
    );
  }

  async create(columnName: Attribute) {
    return ColumnNameModel.create(columnName).then(
      createdColumnName => new ColumnNameEntity(createdColumnName),
    );
  }

  async update(id: string, columnName: Partial<Attribute>) {
    return ColumnNameModel.findByIdAndUpdate(id, columnName).then(
      (updatedColumnName: AttributeDoc) => new ColumnNameEntity(updatedColumnName),
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

  async batchFind(attributeIds: string[], option={ name: 0, _id: 0, __v: 0}) {
    return ColumnNameModel.find({ id: { $in : attributeIds }}, option).then((values: unknown) => {return values});
  }

  // TODO test this
  async findAll(option?: QueryOptions) {
    return ColumnNameModel.find({}, option);
  }

  async findAllColumnId() {
    return ColumnNameModel.find({}).then((fetchedColumnNames: AttributeDoc[]) =>
      fetchedColumnNames.map(
        fetchedColumnName => fetchedColumnName.id
      ),
    );
  }

  async findById(id: string) {
    return ColumnNameModel.find({ _id: id }).then((result: AttributeDoc[]) => {
      if (result.length == 0) {
        return [];
      }
      else {
        return new ColumnNameEntity(result[0]);
      }
    })
  }
}
