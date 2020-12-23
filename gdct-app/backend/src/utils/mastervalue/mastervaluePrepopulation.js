import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';
import COATreeRepository from '../../repositories/COATree';
import COAGroupRepository from '../../repositories/COAGroup';
import SheetNameRepository from '../../repositories/SheetName';

const columNameRepository = Container.get (ColumnNameRepository)
const coaRepository = Container.get(COARepository);
const masterValueRepository = Container.get(MasterValueRepository);
const reportingPeriodRepository = Container.get(ReportingPeriodRepository);
const coaTreeRepository = Container.get(COATreeRepository);
const coaGroupRepository = Container.get(COAGroupRepository);
const sheetNameRepository = Container.get(SheetNameRepository);



/**
 * Maps column with `Column` - which represents the column header
 */
export const extractAttributeIds = sheetData => {
  const columns = {};
  const firstRow = sheetData.data[0].rowData[0].values;

  if (firstRow) {
    for (const column in firstRow) {
      const columnNumber = +column;

      if (columnNumber > 0) {
        const categoryData = getCellData(sheetData, 0, columnNumber);

        if (categoryData && categoryData.value) {
          columns[column] = categoryData.value;
        }
      }
    }
  }

  return columns;
};

/**
 * Maps rows with COA data
 */
export const extractCategoryData = (sheetData) => {
  // Initialize COAs
  const COAs = {};

  for (const row in sheetData.data[0].rowData) {
    // Checks each row in the sheet
    const rowNumber = +row;

    if (rowNumber > 0 ) {
      // Gets the value in column 0 of each row
      const COAIdData = getCellData(sheetData, rowNumber, 0);

      // If there is a value present, insert it into the COAs
      if (COAIdData && COAIdData.value) {
        COAs[row] = COAIdData.value;

      }
    }
  }

  return COAs;
};


export const extractCOAColumnPairs = sheetData => {
  const masterValueGroups = [];
  // Get all the Column IDs located at the first row of the sheet
  const columnIds = extractAttributeIds(sheetData);
  //Get all the COA Data
  const COAIds = extractCategoryData(sheetData);
  // for the rows and columns that contains COA Ids, push it intor master value group
  for (const row in COAIds) {
    for (const column in columnIds) {
      const cellData = getCellData(sheetData, +row, +column);

      if (!masterValueGroups[row]) masterValueGroups[row] = {};
      masterValueGroups[row][column] = cellData.value;

      masterValueGroups.push({
        columnId: columnIds[column],
        ...COAIds[row],
      });
    }
  }

  return masterValueGroups;
};

// Last Updated: Dec 21, 2020
// Insert a workbook, and it will populate the workbook with historical data from the database
export async function mastervaluePrepopulation(workbook) {

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
    // Array of coordinates for the position of the mastervalue
    const newSheet = [];
    // The matched mastervalues from the database are not in order. Iterate through each item in the response to figure out
    // which cell the mastervalue belongs to
    for (const item in res) {
      const masterValueItem = res[item]
      for (const row in categories) {
        if (categories[row].toString() === masterValueItem.CategoryId){
          for (const column in attributes) {
            if (attributes[column].toString() === masterValueItem.AttributeId){
              workbook.sheets[sheet].data[0].rowData[+row].values[+column].userEnteredValue = {
                numberValue: masterValueItem.value
              }
              workbook.sheets[sheet].data[0].rowData[+row].values[+column].effectiveValue = {
                numberValue: masterValueItem.value
              }
              workbook.sheets[sheet].data[0].rowData[+row].values[+column].formattedValue = toString(masterValueItem.value);
            }
          }
        }
      }
    }
    console.log("Population Complete")
  }
  return workbook;
}

// Last Updated: Dec 21, 2020
// Input a sheet from google sheet api with its row and column number, and it will return the value inside the cell
// Currently it will only return a value if the value inside the cell is a number
const getCellData = (sheetData, rowIndex, columnIndex) => {
  // Checks if the row exists
  if (sheetData.data[0].rowData.length <= rowIndex) {
    return undefined;
  }
  const row = sheetData.data[0].rowData[rowIndex];

  // Checks if the column exists
  if (row.values === undefined || row.values <= columnIndex) {
    return undefined;
  }
  const cell = row.values[columnIndex];
  // Checks if the cell is empty
  if (cell === undefined || cell.effectiveValue === undefined){
    return undefined;
  }

  // Logic can go in this loop to eliminate certain cell values
  if (!cell.effectiveValue.numberValue || cell.effectiveValue.numberValue === 0 /*|| !cell.formattedValue.match(/^\s\d+(,\d{3})*$/)*/){
    return undefined;
  }

  const value = cell.effectiveValue.numberValue;
  return { value: value };
};

