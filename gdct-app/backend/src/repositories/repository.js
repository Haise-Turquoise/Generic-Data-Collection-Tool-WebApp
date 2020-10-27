import i18n from 'i18n';
import AppError from '../utils/AppError';

export default class BaseRepository {
  constructor(model) {
    this._model = model;
  }

  find(item) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ item }}`;
    throw new AppError(message);
    
  }

  create(item) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ item }}`;
    throw new AppError(message);
    
  }

  update(id, item) {
    const message = `${i18n.__('MethodNotImplemented')} ${{ id }} ${{ item }}`;
    throw new AppError(message);
   
  }

  async findAll() {
    return this._model.find().then(result => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist'));
      return result.toObject();
    });
  }

  async delete(id) {
    return this._model.findByIdAndDelete(id).then(result => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist')); // throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async findById(id) {
    return this._model.findById(id).then(result => {
      if (!result) throw new AppError(i18n.__('idDoesNotExist')); // throw new Error('_id does not exist');
      return result.toObject();
    });
  }

  async validate(id) {
    return this._model.findById(id).then(document => {
      if (!document) throw `${this._model.collection.name} not found`;
    });
  }

  async validateMany(ids) {
    return this._model
      .find({
        _id: {
          $in: ids,
        },
      })
      .then(documents => {
        const idSet = new Set(ids);

        for (const document of documents) {
          if (!idSet.has(document._id.toString()))
            throw `${this._model.collection.name}(s) not found`;
        }
      });
  }
}
