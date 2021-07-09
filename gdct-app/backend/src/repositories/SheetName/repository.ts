import Container from 'typedi';
import BaseRepository from '../repository';
import SheetNameModel from '../../models/SheetName';
import TemplateRepository from '../Template';
import SheetNameEntity from '../../entities/SheetName';
import { SheetNameDoc } from '../../types/sheetname';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb'

// @Service()
export default class SheetNameRepository extends BaseRepository<SheetNameDoc> {
  private templateRepository: TemplateRepository
  constructor() {
    super(SheetNameModel);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async create(sheetName: SheetNameDoc) {
    return SheetNameModel.create(sheetName)
      .then(sheetName => new SheetNameEntity(sheetName));
  }

  async update(id: string, sheetName: Partial<SheetNameDoc>) {
    return SheetNameModel.findByIdAndUpdate(id, sheetName)
      .then((sheetName: SheetNameDoc) => new SheetNameEntity(sheetName));
  }

  async find(query: FilterQuery<SheetNameDoc>) {
    const realQuery: FilterQuery<SheetNameDoc> = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return SheetNameModel.find(realQuery).then((sheetNames: SheetNameDoc[]) =>
      sheetNames.map(sheetName => new SheetNameEntity(sheetName)),
    );
  }

  async findById(id: string) {
    return SheetNameModel.findById(id);
  }

  async findByName(name: string) {
    return SheetNameModel.find({ name, isActive: true });
  }

  async delete(id: string) {
    return SheetNameModel.findByIdAndDelete(id).then((sheetName: SheetNameDoc) => new SheetNameEntity(sheetName));
  }

  async batchFind(query: ObjectId[] | string[]){
    return SheetNameModel.find({ _id: { "$in" : query }})
  }
}
