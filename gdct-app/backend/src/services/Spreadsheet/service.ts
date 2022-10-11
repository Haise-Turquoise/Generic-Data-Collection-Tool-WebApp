// Created Nov 5, 2020
// Updated by Sheldon Su on 
// The GoogleApi Service is responsible for handling all API requests between the GDCT server and Google

import Container from 'typedi';

import TemplateRepository from '../../repositories/Template';
import COATreeRepository from '../../repositories/COATree';
import COAGroupRepository from '../../repositories/COAGroup';
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName';
import MasterValueRepository from '../../repositories/MasterValue'
import SheetNameRepository from '../../repositories/SheetName'

import Attribute from '../../types/attribute'; 
import Category from '../../types/category';
import CategoryAndAttributeTransferObject from '../../types/spreadsheet';
import CategoryGroup from '../../types/categorygroup';
import MasterValue from '../../types/mastervalue';
import { CategoryDataObject } from '../../types/spreadsheet';
import { OrganizedCategoryTree } from '../../types/categorytree';
import { MasterValueOrg } from '../../types/mastervalue';
import { SheetNameDoc } from '../../types/sheetName';

import { ObjectId } from 'mongodb';


// @Service()
export default class SpreadsheetApisService {

  templateRepository: TemplateRepository;
  COATreeRepository: COATreeRepository;
  COAGroupRepository: COAGroupRepository;
  COARepository: COARepository;
  ColumnNameRepository: ColumnNameRepository;
  masterValueRepository: MasterValueRepository;
  sheetNameRepository: SheetNameRepository;

  constructor() {
    this.templateRepository = Container.get(TemplateRepository);
    this.COATreeRepository = Container.get(COATreeRepository);
    this.COAGroupRepository = Container.get(COAGroupRepository);
    this.COARepository = Container.get(COARepository);
    this.ColumnNameRepository = Container.get(ColumnNameRepository);
    this.masterValueRepository = Container.get(MasterValueRepository);
    this.sheetNameRepository = Container.get(SheetNameRepository);
  }

  // Updated on Nov 16, 2020
  // Returns all attributes and categories in the database. 
  // Structures of the return JSON: 
  /* {
    Categories: [{
      categoryGroup,
      categories,
      childCategory: [];
    }]
    Attributes: [{
      name,
      id
    }]
  } 
  */
  async sendAttributeAndCatagory(){
    // Retrieve all CategoryTrees and Attributes from the database
    let COATreeData:OrganizedCategoryTree[] = await this.COATreeRepository.findAll();
    const AttributeData:Attribute[] = await this.ColumnNameRepository.findAll();
    // JSON object that will contain all the CategoryTrees and Attributes
    let dataToSend:CategoryAndAttributeTransferObject = {Categories:[], Attributes:[]};

    const sheetNameList = [];
    const categoryGroupList = [];
    const categoryList:string[] = [];

    for (let item in COATreeData){
      sheetNameList.push(COATreeData[item].sheetNameId)
      categoryGroupList.push(COATreeData[item].categoryGroupId)
      for (let category in COATreeData[item].categoryId){
        categoryList.push(String(COATreeData[item].categoryId[category]))
      }
    }

    const fullCategoryGroupList = await this.COAGroupRepository.batchFind(categoryGroupList);
    const fullCategoryList = await this.COARepository.batchFindFull(categoryList)
    const fullSheetNamelist = await this.sheetNameRepository.batchFind(sheetNameList);

    // Insert all the Attributes to the JSON Object
    pushAttributes(dataToSend, AttributeData);

    // Some COATrees in the database are a child of another COA tree
    // This function moves child COATrees into a childCategory array
    organizeCOATree(COATreeData)
    await Promise.resolve(pushCategory(dataToSend.Categories, COATreeData, fullCategoryGroupList, fullCategoryList, fullSheetNamelist));
    return dataToSend;
  }


  async findOrgWithMasterValueEntries(){
    return this.masterValueRepository.findAll().then((entries:MasterValue[])=>{
      const organizations:MasterValueOrg[] = [];
      const hashTable = new Map<number, string>();
      entries.forEach(entry=>{
        const {id, name} = entry.org;
        if (!hashTable.has(id)){
          organizations.push(entry.org)
          hashTable.set(id, name);
        }
      });
      return organizations
    })
  }
  

}

// Insert all the Attributes to the JSON Object
function pushAttributes(dataToSend:CategoryAndAttributeTransferObject, AttributeData:Attribute[]){
  for (let i = 0; i < AttributeData.length; i++){
    dataToSend.Attributes.push({name: AttributeData[i].name, id:AttributeData[i].id})
  }
};

// Some COATrees in the database are a child of another COA tree
// This function moves child COATrees into a childCategory array
function organizeCOATree(COATreeData:OrganizedCategoryTree[]){
  for (let i = 0; i < COATreeData.length; i++){
    // Runs if a Category Tree has a parent
    if (COATreeData[i].parentId){
      // Looks for the parent and returns an array for childCategories
      const pos = searchColumn(COATreeData, COATreeData[i].parentId);
      // Pushes the Category Tree into the childCategories array
      if (pos){
        pos.push(COATreeData[i]);
        // @ts-ignore
        COATreeData[i] = {_id: null};
      }
    }
  }
}

// Recursive algorithm for searching for a CategoryTree
function searchColumn(tree:OrganizedCategoryTree[], parentId:ObjectId):any[]|undefined{
  for (let i = 0; i < tree.length; i++){
    const treeItem = tree[i];
    // Runs if CategoryTree with the parentId is found
    if (treeItem._id && treeItem._id.toString() === parentId.toString()){
      // Runs if the tree does not have any childCategory array
      if (!treeItem.hasOwnProperty('childCategories')){
        // Adds the array
        Object.assign(treeItem, {childCategories: []});
      }
      // Returns the array
      return treeItem.childCategories;

    } else if (treeItem.hasOwnProperty('childCategories') && treeItem.childCategories){
      // Runs if the CategoryTree does not match the parentId but it has childCategories.
      const childCategoryArray = searchColumn(treeItem.childCategories, parentId);
      if (childCategoryArray){
        return childCategoryArray;
      }
    }
  }
}

// Insert all the Attributes to the JSON Object
async function pushCategory(dataToSend:CategoryDataObject[], COATreeData:OrganizedCategoryTree[], 
  fullCategoryGroupList:CategoryGroup[], fullCategoryList:Category[], fullSheetNamelist:SheetNameDoc[]){
  for (let i = 0; i < COATreeData.length; i++){
    const COATree = COATreeData[i];
    if (COATree._id){
      // Entries in COATreeData that has been moved into the childCategory array has there _id removed
      // This if loop runs if the COATreeData[i] is the root node

      // Retrieves the categoryGroup from the database
      let id = COATree.categoryGroupId;
      let categoryGroup;
      let sheetName = {name: "Not Assigned"};

      for (let item in fullCategoryGroupList){
        if (String(fullCategoryGroupList[item]._id) === String(id)){
          categoryGroup = fullCategoryGroupList[item]
        }
      }
      id = COATree.sheetNameId;
      for (let item in fullSheetNamelist){
        if (id && String(fullSheetNamelist[item]._id) === String(id)){
          sheetName = fullSheetNamelist[item]
        }
      }

      let categories = [];
      for (let item in COATree.categoryId){
        for (let secondItem in fullCategoryList){
          if (fullCategoryList[secondItem].id === String(COATree.categoryId[item])){
            categories.push(fullCategoryList[secondItem])
          }
        }
      }

      if (categoryGroup){
        dataToSend.push({
          categoryGroup: categoryGroup.name,
          categories: categories, 
          sheetName: sheetName.name,
          childCategory: []
        });
      }else{
        throw new Error(`Category Group with _id: ${id} is missing`);
      }

      if (COATree.childCategories){
        // This loop runs if the COATree has child COATrees
        await pushCategory(dataToSend[dataToSend.length-1].childCategory, COATree.childCategories, fullCategoryGroupList, fullCategoryList, fullSheetNamelist);
      }
    }
  }
}







