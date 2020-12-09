import pako from 'pako';
import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName';
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';

const columNameRepository = Container.get (ColumnNameRepository)
const coaRepository = Container.get(COARepository);
const masterValueRepository = Container.get(MasterValueRepository);
const reportingPeriodRepository = Container.get(ReportingPeriodRepository);

// Using the row and the column index, retrieve the cell value from a sheet 
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

/**
 * Maps column with `Column` - which represents the column header
 */
export const extractColumnNameIds = sheetData => {
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
export const extractCOAData = (sheetData) => {
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
  const columnIds = extractColumnNameIds(sheetData);
  //Get all the COA Data
  const COAIds = extractCOAData(sheetData);
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

export async function extractSubmissionMasterValues(
  id,
  submission,
  org,
  program,
  template,
  templateType,
  reportingPeriod,
){
  const { workbookData } = submission;



  for (const sheetName in workbookData.sheets){
    const masterValues = [];
    const sheetData = workbookData.sheets[sheetName];

    const columns = extractColumnNameIds(sheetData);
    const COAs = extractCOAData(sheetData);

    const categoryIds = [];
    const currentYearAttributes = [];

    for (const row in COAs) {
      categoryIds.push(COAs[row]);
    }

    for (const column in columns){
      const columnId = parseInt(columns[column]);
      const currentPeriod = Math.floor(columnId / 1000);
      let res = await reportingPeriodRepository.findSubmissionClosed({code: currentPeriod})
      if (!res[0].submissionClosed){
        currentYearAttributes.push(columnId);
      }
    }

    const existingAttributes = await columNameRepository.batchFind(currentYearAttributes);
    const existingCategories = await coaRepository.batchFind(categoryIds);

    const filteredAttributes = [];
    const filteredCategories = [];

    for (let attribute in existingAttributes){
      filteredAttributes.push(existingAttributes[attribute].id)
    }

    for (let category in existingCategories){
      filteredCategories.push(parseInt(existingCategories[category].id))
    }
    await masterValueRepository.batchDelete(filteredAttributes, filteredCategories, org);


    for (const row in COAs){
      if (!filteredCategories.includes(COAs[row])){
        delete COAs[row]
      }
    }
    // Delete all column
    for (const col in columns){
      if (!filteredAttributes.includes(columns[col])){
        delete columns[col]
      }
    }

    for (const row in COAs) {
      for (const column in columns) {
        const cellData = getCellData(sheetData, +row, +column);
        if (cellData && cellData.value){
          masterValues.push({
            submission: { _id: submission._id, name: submission.name },
            org,
            program,
            template,
            templateType,
            reportingPeriod: reportingPeriod.name,
            AttributeId: columns[column],
            CategoryId: COAs[row],
            value: cellData.value ,
          });
        }
      }
    }
    Promise.all(masterValues).then(() => {
      masterValueRepository.bulkUpdate(id, masterValues);
    });
    console.log("Mastervalue Populated")
  }
}

export async function populateWorkbook(templateData) {
  const resMasterValue = {};

  
  for (const sheetName in templateData.sheets){

    // For populating workbookData
    const attributeIds = [];
    const categoryIds = [];
    
    const sheetData = templateData.sheets[sheetName];

    const columns = extractColumnNameIds(sheetData);
    const COAs = extractCOAData(sheetData);

    for (const row in COAs) {
      categoryIds.push(COAs[row]);
    }
    for (const column in columns) {
      attributeIds.push(columns[column]);
    }
    let res = await masterValueRepository.batchFind(attributeIds, categoryIds)
    let test = [];
    for (const item in res) {
      const masterValueItem = res[item]
      for (const row in COAs) {
        if (COAs[row] === masterValueItem.CategoryId){
          for (const column in columns) {
            if (columns[column] === masterValueItem.AttributeId){
              test.push({ row: +row, column: +column, value: masterValueItem.value })
            }
          }
        }
      }
    }
    resMasterValue[sheetName] = test;
    console.log("Population Complete")
  }

  return resMasterValue;

}

