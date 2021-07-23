import Container from 'typedi';
import BaseRepository from '../repository';
import DataResumeModel from '../../models/DataResume';
// import TemplateRepository from '../Template';
import DataResumeEntity from '../../entities/DataResume';
import DataResume, { DataResumeDoc } from '../../types/dataresume';
import { FilterQuery } from 'mongoose';

// @Service()
export default class DataResumeRepository extends BaseRepository<DataResume, DataResumeDoc> {
  constructor() {
    super(DataResumeModel);
  }

  // TODO destructuring didn't seem appropriate.. test further @julien
  async create(dataResume: DataResume) {
    return DataResumeModel.create({
        dataResume
    }).then(result => new DataResumeEntity(result));
  }

  async update(id: string, dataResume: Partial<DataResume>) {
    const key = {
      totalCount: dataResume.totalCount,
    };
    return DataResumeModel.findById(id).then((res: DataResumeDoc) => {
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

  async find(query: Partial<DataResume>) {
    const realQuery: FilterQuery<DataResumeDoc> = {};
    let key: keyof DataResume
    for (key in query) {
      if (query[key]) realQuery[key] = query[key];
    }

    return DataResumeModel.find(realQuery).then((dataResumes: DataResumeDoc[]) =>
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