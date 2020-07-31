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

  async create({
    // templateId,
    name,
    isActive,
  }) {
    return (
      // this.templateRepository
      // .validate(templateId)
      // .then(() =>
      //   SheetNameModel.create({
      //     templateId,
      //     name,
      //     isActive
      //   })
      // )
      SheetNameModel.create({
        // templateId,
        name,
        isActive,
      }).then(sheetName => new SheetNameEntity(sheetName))
    );
  }

  async update(
    id,
    {
      // templateId,
      name,
      isActive,
    },
  ) {
    return (
      // this.templateRepository.validate(templateId)
      //   .then(
      //     () => SheetNameModel.findByIdAndUpdate(
      //       id,
      //       {
      //         templateId,
      //         name,
      //         isActive
      //       }
      //     )
      //   )
      SheetNameModel.findByIdAndUpdate(id, {
        // templateId,
        name,
        isActive,
      }).then(sheetName => new SheetNameEntity(sheetName.toObject()))
    );
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
}
