import BaseRepository from '../repository';
import MasterValueModel from '../../models/MasterValue';

export default class MasterValueRepository extends BaseRepository {
  constructor() {
    super(MasterValueModel);
  }

  async bulkUpdate(submissionId, masterValues) {
    return MasterValueModel.deleteMany({ submissionId }).then(() =>
      MasterValueModel.create(masterValues),
    );
  }

  async addDocument(masterValue) {
    // console.log('masterValue at Repository', masterValue)
    const key = {
      categoryId: masterValue.categoryId,
      attributeId: masterValue.attributeId,
      org: {
        id: masterValue.org.id,
        name: masterValue.org.name,
      },
    };
    return MasterValueModel.findOne(key).then(res => {
      if (res) {
        // console.log('find the matched masterValue')
        return MasterValueModel.findByIdAndUpdate(res._id, masterValue);
      }
      // console.log('create a new data')
      return MasterValueModel.create(masterValue);
    });
  }

  // async  recursiveCategoryTreeSearch(currentTree, categoryTreeList, categoryGroupQuery, iteration){
  //   let categoryTreeQuery = [];
  //   categoryTreeList[iteration] = currentTree;
  //   for (let item in currentTree){
  //     if (currentTree[item].parentId){
  //       categoryTreeQuery.push(currentTree[item].parentId.toString());
  //     }
  //     categoryGroupQuery.push(currentTree[item].categoryGroupId);
  //   }
  //   if (categoryTreeQuery.length){
  //     let nextTree = await coaTreeRepository.batchFindById(categoryTreeQuery)
  //     iteration = iteration + 1;
  //     await Promise.resolve(recursiveCategoryTreeSearch(nextTree, categoryTreeList, categoryGroupQuery, iteration));
  //   }
  //   return 0;
  // }
}
