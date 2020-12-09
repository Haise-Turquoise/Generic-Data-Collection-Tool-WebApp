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
import { getSpreadsheet } from '../../middlewares/googleapis/request'
import pako from 'pako'

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

    // Insert all the Attributes to the JSON Object
    pushAttributes(dataToSend, AttributeData);

    // Some COATrees in the database are a child of another COA tree
    // This function moves child COATrees into a childCategory array
    organizeCOATree(COATreeData)
    await Promise.resolve(pushCategory(dataToSend.Categories, COATreeData, this.COAGroupRepository, this.COARepository));

    const deflatedData = pako.deflate(JSON.stringify(dataToSend), { to: 'string' });
    const wrappedData = {"data" : deflatedData};

    return wrappedData;
  }

  // Updated on Nov 24, 2020
  // Real time update of Google Sheet input
  async updateSpreadsheet(spreadsheetData){
    const { spreadsheetId, row, column, sheet, value } = JSON.parse(spreadsheetData.data);
    // Retrive the template from database
    const googleSheet = await this.googleSheetRepository.find({ googleSheetId: spreadsheetId })
    const templateId = googleSheet[0].templateId;
    const template = await this.templateRepository.findById(templateId);
    // If the templateData is empty or the sheet is not present
    if (!template.templateData.sheets || !template.templateData.sheets[sheet]){
      const res = await Promise.resolve(getSpreadsheet(spreadsheetId));
      // const unwrappedData = res.data;
      // const newTemplate = pako.inflate(unwrappedData, { to: 'string' });
      // console.log(newTemplate)
      //console.log(JSON.parse(newTemplate))
      //newTemplate.delete()
      //)
      const newTemplate = res
      delete newTemplate.spreadsheetUrl;
      delete newTemplate.spreadsheetId;
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
async function pushCategory(dataToSend, COATreeData, COAGroupRepository, COARepository){
  for (let i = 0; i < COATreeData.length; i++){
    const COATree = COATreeData[i];
    if (COATree._id){
      // Entries in COATreeData that has been moved into the childCategory array has there _id removed
      // This if loop runs if the COATreeData[i] is the root node

      // Retrieves the categoryGroup from the database
      const id = COATree.categoryGroupId;
      const categoryGroup = await COAGroupRepository.findById(id) 

      let categories = [];
      for (let j = 0; j < COATree.categoryId.length; j++){
        // A CategoryTree may have multiple categoryIds 
        // This for loop goes through each categoryId and retrieves them from the database
        const category = await COARepository.findByIDNumber({id: String(COATree.categoryId[j])})
        for (let k = 0; k < category.length; k++){
          // The category returns an array of objects in the database with the categoryId
          // Hopefully, the length of category is always one. 
          const categoryItem = category[k];
          categories.push({
            id: categoryItem.id, 
            name: categoryItem.name, 
            COA: categoryItem.COA, 
            unitOfMeasure: categoryItem.unitOfMeassure
          })
        }
      }
      dataToSend.push({
        categoryGroup: categoryGroup.name,
        categories: categories, 
        childCategory: []
      });

      if (COATree.childCategories){
        // This loop runs if the COATree has child COATrees
        await pushCategory(dataToSend[dataToSend.length-1].childCategory, COATree.childCategories, COAGroupRepository, COARepository);
      }
    }
  }
}

