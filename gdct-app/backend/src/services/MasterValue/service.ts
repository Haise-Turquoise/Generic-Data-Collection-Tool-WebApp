import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import MasterValue from '../../types/mastervalue';
import COATreeRepository from '../../repositories/COATree';
import COAGroupRepository from '../../repositories/COAGroup';
import CategoryTree from '../../types/categorytree';
import { ObjectId } from 'mongodb';
// @Service()

const coaTreeRepository = Container.get(COATreeRepository);
const coaGroupRepository = Container.get(COAGroupRepository);

export default class MasterValueService {
  private masterValueRepository: MasterValueRepository

  constructor() {
    this.masterValueRepository = Container.get(MasterValueRepository);
  }

  async createMasterValue(masterValue: MasterValue) {
    return this.masterValueRepository.create(masterValue);
  }

  async deleteMasterValue(id: string) {
    return this.masterValueRepository.delete(id);
  }

  async updateMasterValue(id: string, masterValue: Partial<MasterValue>) {
    return this.masterValueRepository.update(id, masterValue);
  }

  async findMasterValue(masterValue: Partial<MasterValue>) {
    return this.masterValueRepository.find(masterValue);
  }

  async addDocument(masterValue: MasterValue) {
    const query = [];
    query.push(masterValue.categoryId);
    const categoryTreeList: {[key: number]: CategoryTree[]} = {};
    const categoryGroupQuery: ObjectId[] = [];
    const categoryTrees: CategoryTree[] = await coaTreeRepository.batchFindByCategoryIdWithoutSheetName(query);

    await Promise.resolve(
      this.recursiveCategoryTreeSearch(categoryTrees, categoryTreeList, categoryGroupQuery, 0),
    );

    const categoryGroupList = await coaGroupRepository.batchFind(categoryGroupQuery);
    // console.log(categoryGroupList);
    let string = '';
    for (const item in categoryGroupList) {
      string += categoryGroupList[item].name;
      string += ', ';
    }
    string = string.substring(0, string.length - 2);
    masterValue.categoryGroup = string;
    return this.masterValueRepository.addDocument(masterValue);
  }

  async recursiveCategoryTreeSearch(
      currentTree: CategoryTree[],
      categoryTreeList: {[key: number]: CategoryTree[]},
      categoryGroupQuery: ObjectId[],
      iteration: number
    ) {
    const categoryTreeQuery = [];
    categoryTreeList[iteration] = currentTree;
    for (const item in currentTree) {
      if (currentTree[item].parentId) {
        categoryTreeQuery.push(currentTree[item].parentId.toString());
      }
      categoryGroupQuery.push(currentTree[item].categoryGroupId);
    }
    if (categoryTreeQuery.length) {
      const nextTree = await coaTreeRepository.batchFindById(categoryTreeQuery);
      iteration += 1;
      await Promise.resolve(
        this.recursiveCategoryTreeSearch(nextTree, categoryTreeList, categoryGroupQuery, iteration),
      );
    }
    return 0;

  }
}
