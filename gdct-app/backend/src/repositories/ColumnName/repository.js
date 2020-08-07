import ColumnNameEntity from '../../entities/ColumnName';
import BaseRepository from '../repository';
import ColumnNameModel from '../../models/ColumnName';

export default class ColumnNameRepository extends BaseRepository {
  constructor() {
    super(ColumnNameModel);
  }

  async delete(id) {
    return ColumnNameModel.findByIdAndDelete(id).then(
      deletedColumnName => new ColumnNameEntity(deletedColumnName.toObject()),
    );
  }

  async create(columnName) {
    return ColumnNameModel.create(columnName).then(
      createdColumnName => new ColumnNameEntity(createdColumnName.toObject()),
    );
  }

  async update(id, columnName) {
    return ColumnNameModel.findByIdAndUpdate(id, columnName).then(
      updatedColumnName => new ColumnNameEntity(updatedColumnName.toObject()),
    );
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return ColumnNameModel.find(realQuery).then(fetchedColumnNames =>
      fetchedColumnNames.map(
        fetchedColumnName => new ColumnNameEntity(fetchedColumnName.toObject()),
      ),
    );
  }
}
