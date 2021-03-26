import Container from 'typedi';
import pako from 'pako'
import MasterValueRepository from '../../repositories/MasterValue';
import { extractAttributeIds, extractCategoryData } from './excel';


const masterValueRepository = Container.get(MasterValueRepository);

// Last Updated: Dec 21, 2020
// Insert a workbook, and it will populate the workbook with historical data from the database
export async function mastervaluePrepopulation(workbook) {
  const inflatedWorkbook = pako.inflate( workbook, { to: 'string' });
  workbook = JSON.parse(inflatedWorkbook);
  // Go through each sheet
  for (const sheetName in workbook.sheets){

    // The present sheet
    const sheetData = workbook.sheets[sheetName];

    // Extract attribute and category Ids present in the sheet
    const attributes = extractAttributeIds(sheetData);
    const categories = extractCategoryData(sheetData);
    // To move the attributies and categories into an array to send a request to the database
    const attributeIds = [];
    const categoryIds = [];

    // Categories and Attributes are stored as string in the database, hence the toString()
    for (const row in categories) {
      categoryIds.push(categories[row].toString());
    }

    for (const column in attributes) {
      attributeIds.push(attributes[column].toString());
    }
    // Search the mastervalues/historical datas in the database with any combination of attribute and column Ids
    const res = await masterValueRepository.batchFind(attributeIds, categoryIds);
    // The matched mastervalues from the database are not in order. Iterate through each item in the response to figure out
    // which cell the mastervalue belongs to
    for (const item in res) {
      const masterValueItem = res[item]
      for (const row in categories) {
        if (categories[row].toString() === masterValueItem.categoryId){
          for (const column in attributes) {
            if (attributes[column].toString() === masterValueItem.attributeId){
              workbook.sheets[sheetName].data[0].rowData[+row].values[+column].userEnteredValue = {
                numberValue: masterValueItem.value
              }
              workbook.sheets[sheetName].data[0].rowData[+row].values[+column].effectiveValue = {
                numberValue: masterValueItem.value
              }
              workbook.sheets[sheetName].data[0].rowData[+row].values[+column].formattedValue = toString(masterValueItem.value);
            }
          }
        }
      }
    }
  }
  const title = workbook.properties.title;
  workbook = pako.deflate(JSON.stringify(workbook), { to: 'string' })
  workbook = {
    name: title,
    data: workbook,
  }
  return workbook;
}

export const extractAttributeIds1 = (sheet)=>{
  const targetRow = sheet.rows[0];
  const attributeMap = {}
  if (targetRow){
    const attributeRow = targetRow.cells;
    for (const key in attributeRow){
      // Record the col if entry in cell is a number
      if (attributeRow[key] && !isNaN(attributeRow[key].text) && attributeRow[key].text !== ""){
        attributeMap[attributeRow[key].text] = key;
      }
    }
  }
  return attributeMap
}

export const extractCategoryIds1 = (sheet)=>{
  // @ts-ignore
  const maxRowNum = Math.max(...Object.keys(sheet.rows).slice(0, -1))
  const categoryMap = {};

  // Go though each row's first cell
  for (let ri = 0; ri <= maxRowNum; ri++){
    const targetRow = sheet.rows[ri];
    if (targetRow){
      const targetCells = targetRow.cells[0];
      if (targetCells && !isNaN(targetCells.text) && targetCells.text !== ""){
        categoryMap[targetCells.text] = ri;
      }
    }
  }
  return categoryMap;
}

// Last Updated: 2021/03/15 by Sheldon Su
// Insert a workbook, and it will populate the workbook with historical data from the database
export async function mastervaluePrepopulationTest(workbook, orgId){
  for(let i = 0; i < workbook.length; i++){
    let sheet = workbook[i];
    // Obtain the mapping for all the attribute and category id in the sheet 
    let categoryMap = extractCategoryIds1(sheet);
    let attributeMap = extractAttributeIds1(sheet);

    const categoryList = Object.keys(categoryMap);
    const attributeList = Object.keys(attributeMap);

    // Find the corresponding attributes in the DB, any of the mapping is empty, skip the DB query
    const res = categoryList.length > 0 && attributeList.length > 0 ? await masterValueRepository.batchFind(attributeList, categoryList, orgId) : [];

    // populate the sheet with master values according to the mappings
    for (const item in res) {
      let masterValueItem = res[item];
      let ri = categoryMap[masterValueItem.CategoryId];
      let ci = attributeMap[masterValueItem.AttributeId];
      sheet.rows[ri].cells[ci].text = masterValueItem.value;
    }
  }

  return workbook;

}



