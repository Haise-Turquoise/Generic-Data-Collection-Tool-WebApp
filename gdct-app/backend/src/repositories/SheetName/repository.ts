import Container from 'typedi';
import BaseRepository from '../repository';
import SheetNameModel from '../../models/SheetName';
import TemplateRepository from '../Template';
import SheetNameEntity from '../../entities/SheetName';
import SheetName, { SheetNameDoc } from '../../types/sheetName';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb'
import AppError from '../../utils/AppError';

// @Service()
export default class SheetNameRepository extends BaseRepository<SheetName, SheetNameDoc> {
  private templateRepository: TemplateRepository
  constructor() {
    super(SheetNameModel);
    this.templateRepository = Container.get(TemplateRepository);
  }

  async create(sheetName: SheetName) {
    return SheetNameModel.create(sheetName)
      .then(sheetName => new SheetNameEntity(sheetName));
  }

  async update(id: string, sheetName: Partial<SheetName>) {
    return SheetNameModel.findByIdAndUpdate(id, sheetName)
      .then((sheetName: SheetNameDoc|null) => {
        if (!sheetName) throw new AppError(`Update failed for SheetName item with ID: ${id}`);
        return new SheetNameEntity(sheetName);
      });
  }

  async find(query: Partial<SheetName>) {
    const realQuery: FilterQuery<SheetNameDoc> = {};
    let key: keyof SheetName
    for (key in query) {
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
    return SheetNameModel.findByIdAndDelete(id)
    .then((sheetName: SheetNameDoc|null) => {
      if (!sheetName) throw new AppError(`Delete failed, Item not found for SheetName item with ID: ${id}`);
      return new SheetNameEntity(sheetName)
    });
  }

  async batchFind(query: ObjectId[] | string[]){
    return SheetNameModel.find({ _id: { "$in" : query }})
  }
}
