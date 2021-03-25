// Created Nov 5, 2020
// The GoogleApi Service is responsible for handling all API requests between the GDCT server and Google

import Container from 'typedi';
import TemplateRepository from '../../repositories/Template';
import COATreeRepository from '../../repositories/COATree';
import COAGroupRepository from '../../repositories/COAGroup';
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName';
import GoogleSheetRepository from '../../repositories/GoogleSheet';
import MasterValueRepository from '../../repositories/MasterValue'
import SheetNameRepository from '../../repositories/SheetName'
import { getSpreadsheet, deleteGoogleSheet } from '../../middlewares/googleapis/request'
import {saveGoogleSheetInTemplate, saveGoogleSheetInSubmission} from '../../middlewares/googleapis/save'
import pako from 'pako'
import fs from 'fs'

// @Service()
export default class GoogleApisService {
  constructor() {
    this.templateRepository = Container.get(TemplateRepository);
    this.COATreeRepository = Container.get(COATreeRepository);
    this.COAGroupRepository = Container.get(COAGroupRepository);
    this.COARepository = Container.get(COARepository);
    this.ColumnNameRepository = Container.get(ColumnNameRepository);
    this.googleSheetRepository = Container.get(GoogleSheetRepository)
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
    let COATreeData = await this.COATreeRepository.findAll();
    const AttributeData = await this.ColumnNameRepository.findAll();
    // JSON object that will contain all the CategoryTrees and Attributes
    let dataToSend  = {'Categories':[], 'Attributes':[]};

    const sheetNameList = [];
    const categoryGroupList = [];
    const categoryList = [];

    for (let item in COATreeData){
      sheetNameList.push(COATreeData[item].sheetNameId)
      categoryGroupList.push(COATreeData[item].categoryGroupId)
      for (let category in COATreeData[item].categoryId){
        categoryList.push(COATreeData[item].categoryId[category])
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

  // Updated on Nov 24, 2020
  // Real time update of Google Sheet input
  async updateSpreadsheet(spreadsheetData){
    const { spreadsheetId, row, column, sheet, value } = JSON.parse(spreadsheetData.data);
    // Retrive the template from database
    const googleSheet = await this.googleSheetRepository.find({ googleSheetId: spreadsheetId })
    const templateId = googleSheet[0].templateId;
    let template = await this.templateRepository.findById(templateId);

    const inflatedTemplateData = pako.inflate( template.templateData, { to: 'string' });
    template.templateData = JSON.parse(inflatedTemplateData);
    // If the templateData is empty or the sheet is not present
    if (!template.templateData.sheets || !template.templateData.sheets[sheet]){
      const res = await Promise.resolve(getSpreadsheet(spreadsheetId));

      let newTemplate = res
      delete newTemplate.spreadsheetUrl;
      delete newTemplate.spreadsheetId;
      newTemplate = pako.deflate(JSON.stringify(newTemplate), { to: 'string' })
      this.templateRepository.updateTemplate(templateId, newTemplate);
    } else {
      // If the length of row in the spreadsheet is not large enough
      const spreadsheetRow = template.templateData.sheets[sheet].data[0].rowData;
      while (!spreadsheetRow[row]){
        spreadsheetRow.push({});
      }
      if (!spreadsheetRow[row].values){
        spreadsheetRow[row] = {
          values: [],
        }
      }

      // If the length of the column in the spreadsheet is not large enough
      const spreadsheetColumn = spreadsheetRow[row].values
      while (!spreadsheetColumn[column]){
        spreadsheetColumn.push({});
      }
      spreadsheetColumn[column] = value;

      this.templateRepository.updateTemplate(templateId, template.templateData)
      }
  }

  async findOrgWithMasterValueEntries(){
    return this.masterValueRepository.findAll().then(entries=>{
      const organizations = [];
      const hashTable = {};
      entries.forEach(entry=>{
        const {id, name} = entry.org;
        if (hashTable[id] === undefined){
          organizations.push(entry.org)
          hashTable[id] = name;
        }
      });
      return organizations
    })
  }
  
  async updatePreview(request){
    request = JSON.parse(request).data
    const id = request[0].id;
    const coordinate = [];
    
    for (let item in request){
      coordinate.push(request[item].coordinate);
    }
    let filter = {
      googleSheetId: id,
    }

    let update = {
      previewCoord: coordinate ,
    }
    this.googleSheetRepository.findOneAndUpdate(filter, update);
  }

  async getPreview(spreadsheetId){
    const res = await this.googleSheetRepository.findPreview(spreadsheetId);
    let filter = {
      googleSheetId: spreadsheetId,
    }
    let update = {
      previewCoord: [],
    }
    this.googleSheetRepository.findOneAndUpdate(filter, update);
    return res[0].previewCoord;
  }

  async save(spreadsheetId){
    const res = await this.googleSheetRepository.find({googleSheetId: spreadsheetId});
    if (res[0].templateId){
      await Promise.resolve(saveGoogleSheetInTemplate(res[0]));

      // deleteGoogleSheet(res[0].googleSheetId, res[0].duplicateId /*, openGoogleSheets[i].triggerId*/);
      // // Delete the GoogleSheet Collection object
      // const googleSheetRepository = Container.get(GoogleSheetRepository);
      // googleSheetRepository.delete(res[0]._id);

    } else if (res[0].submissionId){
      saveGoogleSheetInSubmission(res[0]._id)
    }

  }
}

// Insert all the Attributes to the JSON Object
function pushAttributes(dataToSend, AttributeData){
  for (let i = 0; i < AttributeData.length; i++){
    dataToSend.Attributes.push({'name': AttributeData[i].name, 'id':AttributeData[i].id})
  }
};

// Some COATrees in the database are a child of another COA tree
// This function moves child COATrees into a childCategory array
function organizeCOATree(COATreeData){
  for (let i = 0; i < COATreeData.length; i++){
    // Runs if a Category Tree has a parent
    if (COATreeData[i].parentId){
      // Looks for the parent and returns an array for childCategories
      const pos = searchColumn(COATreeData, COATreeData[i].parentId);
      // Pushes the Category Tree into the childCategories array
      if (pos){
        pos.push(COATreeData[i]);
        COATreeData[i] = {_id: null};
      }
    }
  }
}

// Recursive algorithm for searching for a CategoryTree
function searchColumn(tree, parentId, firstIteration = true){
  for (let i = 0; i < tree.length; i++){
    const treeItem = tree[i];
    // Runs if CategoryTree with the parentId is found
    if (treeItem._id && treeItem._id.toString() === parentId.toString()){
      // Runs if the tree does not have any childCategory array
      if (!treeItem.childCategories){
        // Adds the array
        treeItem.childCategories = [];
      }
      // Returns the array
      return treeItem.childCategories;
    } else if (treeItem.childCategories){
      // Runs if the CategoryTree does not match the parentId but it has childCategories.
      const childCategoryArray = searchColumn(treeItem.childCategories, parentId);
      if (childCategoryArray){
        return childCategoryArray;
      }
    }
  }
}

// Insert all the Attributes to the JSON Object
async function pushCategory(dataToSend, COATreeData, fullCategoryGroupList, fullCategoryList, fullSheetNamelist){
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
        if (fullCategoryGroupList[item]._id.toString() === id.toString()){
          console.log('run 1')
          categoryGroup = fullCategoryGroupList[item]
        }
      }
      id = COATree.sheetNameId;
      for (let item in fullSheetNamelist){
        if (id && fullSheetNamelist[item]._id.toString() === id.toString()){
          console.log('run 2')
          sheetName = fullSheetNamelist[item]
        }
      }

      let categories = [];
      for (let item in COATree.categoryId){
        for (let secondItem in fullCategoryList){
          if (fullCategoryList[secondItem].id === COATree.categoryId[item]){
            console.log('run 3')
            categories.push(fullCategoryList[secondItem])
          }
        }
      }
      dataToSend.push({
        categoryGroup: categoryGroup.name,
        categories: categories, 
        sheetName: sheetName.name,
        childCategory: []
      });

      if (COATree.childCategories){
        // This loop runs if the COATree has child COATrees
        await pushCategory(dataToSend[dataToSend.length-1].childCategory, COATree.childCategories, fullCategoryGroupList, fullCategoryList, fullSheetNamelist);
      }
    }
  }
}







