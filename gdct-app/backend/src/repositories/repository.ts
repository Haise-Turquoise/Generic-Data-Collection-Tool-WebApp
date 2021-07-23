// @ts-ignore
import i18n from 'i18n';
import { ObjectId } from 'mongodb';
import { Model, Document, FilterQuery, QueryOptions } from 'mongoose';
import AppError from '../utils/AppError';

export default class BaseRepository<T, U extends T & Document> {
  protected _model: Model<U>
  constructor(model: Model<U>) {
    this._model = model;
  }

  find(item: Partial<T>) {
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
    return this._model.find({}, null, option).then((result: U[]) => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist'));
      return result;
    });
  }

  async delete(id: string) {
    return this._model.findByIdAndDelete(id).then((result: U | null) => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist')); // throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async findById(id: string | number | ObjectId) {
    return this._model.findById(id).then((result: U | null) => {
      if (!result) {;throw new AppError(i18n.__('idDoesNotExist'));} // throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async validate(id: string | ObjectId) {
    return this._model.findById(id).then((document: T | null) => {
      if (!document) throw new AppError(`${this._model.collection.name} not found. Id: ${id}`);
    });
  }

  async validateMany(ids: any[]) {
    //@ts-ignore
    const filter: FilterQuery<U> = { _id: { $in: ids }}
    return this._model.find(filter)
      .then((documents: U[]) => {
        const idSet = new Set(ids);
        for (const document of documents) {
          if (!idSet.has(document._id.toString()))
            throw `${this._model.collection.name}(s) not found`;
        }
      });
  }
}
