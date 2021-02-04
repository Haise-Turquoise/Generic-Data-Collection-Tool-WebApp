import Container from 'typedi';
import BaseRepository from '../repository';
import SheetNameModel from '../../models/SheetName';
import TemplateRepository from '../Template';
import SheetNameEntity from '../../entities/SheetName';

// @Service()
export default class SheetNameRepository extends BaseRepository {
  constructor() {
    super(SheetNameModel);

    this.templateRepository = Container.get(TemplateRepository);
  }

  async create({ name, isActive }) {
    return SheetNameModel.create({
      name,
      isActive,
    }).then(sheetName => new SheetNameEntity(sheetName));
  }

  async update(id, { name, isActive }) {
    return SheetNameModel.findByIdAndUpdate(id, {
      name,
      isActive,
    }).then(sheetName => new SheetNameEntity(sheetName.toObject()));
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return SheetNameModel.find(realQuery).then(sheetNames =>
      sheetNames.map(sheetName => new SheetNameEntity(sheetName)),
    );
  }

  async findById(id) {
    return SheetNameModel.findById(id);
  }

  async findByName(name) {
    return SheetNameModel.find({ name, isActive: true });
  }

  async delete(id) {
    return SheetNameModel.findByIdAndDelete(id).then(sheetName => new SheetNameEntity(sheetName));
  }

  async batchFind(query){
    return SheetNameModel.find({ _id: { "$in" : query }})
  }
}
