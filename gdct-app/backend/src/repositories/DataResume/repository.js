import Container from 'typedi';
import BaseRepository from '../repository';
import DataResumeModel from '../../models/DataResume';
// import TemplateRepository from '../Template';
import DataResumeEntity from '../../entities/DataResume';

// @Service()
export default class DataResumeRepository extends BaseRepository {
  constructor() {
    super(DataResumeModel);

    // this.templateRepository = Container.get(TemplateRepository);
  }

  async create({ dataResume }) {
    return DataResumeModel.create({
        dataResume
    }).then(result => new DataResumeEntity(result.toObject()));
  }

  async update(dataResume) {
    const key = {
      totalCount: dataResume.totalCount,
      
    };
    return DataResumeModel.findOne({}).then(res => {
      if (res) {
        
        // console.log('find the matched masterValue')
        return DataResumeModel.findOneAndUpdate({}, dataResume);
      }
      // console.log('create a new data')
      return DataResumeModel.create(dataResume);
    });
    // return DataResumeModel.create(
    //     dataResume
    // ).then(dataResume => new DataResumeEntity(dataResume.toObject()));
  }

  async find(query) {
    const realQuery = {};

    for (const key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return DataResumeModel.find(realQuery).then(dataResumes =>
      dataResumes.map(dataResume => new DataResumeEntity(dataResume)),
    );
  }

//   async findById(id) {
//     return SheetNameModel.findById(id);
//   }

//   async findByName(name) {
//     return SheetNameModel.find({ name, isActive: true });
//   }

//   async delete(id) {
//     return SheetNameModel.findByIdAndDelete(id).then(sheetName => new SheetNameEntity(sheetName));
//   }

//   async batchFind(query){
//     return SheetNameModel.find({ _id: { "$in" : query }})
//   }
}