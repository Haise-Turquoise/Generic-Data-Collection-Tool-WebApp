import i18n from 'i18n';
import { Model, Document, FilterQuery, QueryOptions } from 'mongoose';
import AppError from '../utils/AppError';

export default class BaseRepository<T extends Document> {
  protected _model: Model<T>
  constructor(model: Model<T>) {
    this._model = model;
  }

  find(item: FilterQuery<T>) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ item }}`;
    throw new AppError(message);
  }

  create(item: T) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ item }}`;
    throw new AppError(message);
  }

  update(id: string, item: Partial<T>) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ id }} ${{ item }}`;
    throw new AppError(message);
  }

  async findAll(option?: QueryOptions) {
    // TODO test this
    return this._model.find({}, option).then((result: T[]) => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist'));
      return result;
    });
  }

  async delete(id: string) {
    return this._model.findByIdAndDelete(id).then((result: T | null) => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist')); // throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async findById(id: string) {
    return this._model.findById(id).then((result: T | null) => {
      if (!result) {;throw new AppError(i18n.__('idDoesNotExist'));} // throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async validate(id: string) {
    return this._model.findById(id).then((document: T | null) => {
      if (!document) throw `${this._model.collection.name} not found`;
    });
  }

  async validateMany(ids: any[]) {
    //@ts-ignore
    const filter: FilterQuery<T> = { _id: { $in: ids }}
    return this._model.find(filter)
      .then((documents: T[]) => {
        const idSet = new Set(ids);
        for (const document of documents) {
          if (!idSet.has(document._id.toString()))
            throw `${this._model.collection.name}(s) not found`;
        }
      });
  }
}
