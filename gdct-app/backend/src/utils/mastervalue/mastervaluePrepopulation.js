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
      console.log("Point 1: ", masterValueItem)
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
    console.log("Population Complete")
  }

  workbook = pako.deflate(JSON.stringify(workbook), { to: 'string' })
  return workbook;
}



