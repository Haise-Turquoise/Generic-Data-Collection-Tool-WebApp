import pako from 'pako';
import Container from 'typedi';
import MasterValueRepository from '../../repositories/MasterValue';
import COARepository from '../../repositories/COA';
import ColumnNameRepository from '../../repositories/ColumnName'
import ReportingPeriodRepository from '../../repositories/ReportingPeriod';

const columNameRepository = Container.get (ColumnNameRepository)
const coaRepository = Container.get(COARepository);
const sheetNameRepository = Container.get(SheetNameRepository);
const masterValueRepository = Container.get(MasterValueRepository);

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

  if (cell === undefined){
    return undefined;
  }
  if (cell.formattedValue === undefined) {
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

// /**
//  * Maps column with `Column` - which represents the column header
//  */
// export const extractColumnNameIds = sheetData => {
//   const columns = {};
//   const firstRow = sheetData.data[0].rowData[0].values;

//   if (firstRow) {
//     for (const column in firstRow) {
//       const columnNumber = +column;

//       if (columnNumber > 1) {
//         const categoryData = getCellData(sheetData, 1, columnNumber);

//         if (categoryData && categoryData.value) {
//           columns[column] = categoryData.value;
//         }
//       }
//     }
//   }

//   return columns;
// };

// /**
//  * Maps rows with COA data
//  */
// export const extractCOAData = sheetData => {
//   const COAs = {};

//   for (const row in sheetData.data[0].rowData) {
//     const rowNumber = +row;

//     if (rowNumber > 1) {
//       const COAIdData = getCellData(sheetData, rowNumber, 1);
//       const COATreeIdData = getCellData(sheetData, rowNumber, 2);

//       // ? Could be possible that COATreeId is not needed, ie no grouping
//       if (COAIdData && COAIdData.value) {
//         COAs[row] = {
//           COAId: COAIdData.value,
//           COATreeId: COATreeIdData ? COATreeIdData.value : undefined,
//         };
//       }
//     }
//   }

//   return COAs;
// };

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


export const extractWorkbookMasterValues = (workbookData, submissionId) => {
  const masterValues = [];

  for (const sheetName in workbookData.workbookData) {
    const sheetData = JSON.parse(
      pako.inflate(workbookData.workbookData[sheetName], { to: 'string' }),
    ).sheetCellData;

    const columns = extractColumnNameIds(sheetData);
    const COAs = extractCOAData(sheetData);

    for (const row in COAs) {
      for (const column in columns) {
        const cellData = getCellData(sheetData, +row, +column);

        masterValues.push({
          submissionId,
          columnNameId: columns[column],
          ...COAs[row],
          value: cellData ? cellData.value : undefined,
        });
      }
    }
  }

  return masterValues;
};


export const extractSubmissionMasterValues = (
  id,
  submission,
  org,
  program,
  template,
  templateType,
  reportingPeriod,
) => {
  console.log('extractSubmission')
  const { workbookData } = submission;

  const masterValues = [];
  coaRepository.findAllCoaId().then(categoryData=>{
    columNameRepository.findAllColumnId().then(AttributeData=>{
      console.log('================extractMasterValue==================')
      for (const sheetName in workbookData.sheets){
        const sheetData = workbookData.sheets[sheetName];
        const columns = extractColumnNameIds(sheetData);
        const COAs = extractCOAData(sheetData);
        console.log('================printing column data and coa=================')
        console.log(columns, AttributeData)
        // Delete all the rows that does not match an existing category id
        console.log('================DeleteValue=================')
        for (const row in COAs){
          if (!categoryData.includes(COAs[row])){
            delete COAs[row]
          }
        }

        // Delete all column
        console.log('===============DeleteValue===================')
        for (const col in columns){
          if (!AttributeData.includes(columns[col])){
            delete columns[col]
          }
        }
        console.log(columns, COAs);

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
                reportingPeriod: submission.reportingPeriod,
                AttributeId: columns[column],
                CategoryId: COAs[row],
                value: cellData.value ,
              });
              console.log({
                submission: { _id: submission._id, name: submission.name },
                org,
                program,
                template,
                templateType,
                reportingPeriod: submission.reportingPeriod,
                AttributeId: columns[column],
                CategoryId: COAs[row],
                value: cellData.value ,
              })
            }
          }
        }
        Promise.all(masterValues).then(() => {
          masterValueRepository.bulkUpdate(id, masterValues);
        });
      }
    });
  });
}

// export const extractSubmissionMasterValues = (
//   id,
//   submission,
//   org,
//   program,
//   template,
//   templateType,
// ) => {

//   const { workbookData } = submission;

//   const masterValues = [];

//   for (const sheetName in workbookData.sheets){
//     const sheetData = workbookData.sheets[sheetName];

//     const columns = extractColumnNameIds(sheetData);
//     const COAs = extractCOAData(sheetData);
//     console.log(columns, COAs);
//     for (const row in COAs) {
//       for (const column in columns) {
//         const cellData = getCellData(sheetData, +row, +column);
//         console.log(cellData);
//         if (cellData && cellData.value){
//           masterValues.push({
//             submission: { _id: submission._id, name: submission.name },
//             org,
//             program,
//             template,
//             templateType,
//             reportingPeriod: submission.reportingPeriod,
//             AttributeId: columns[column],
//             CategoryId: COAs[row],
//             value: cellData.value ,
//           });
//         }
//       }
//     }
//     console.log(masterValues)
//     Promise.all(masterValues).then(() => {
//       masterValueRepository.bulkUpdate(id, masterValues);
//     });
//   }
// }

// export const extractSubmissionMasterValues = (
//   id,
//   submission,
//   org,
//   program,
//   template,
//   templateType,
// ) => {
//   const { workbookData } = submission;

//   const masterValues = [];
//   const promiseQuery = [];

//   for (const sheetName in workbookData.workbookData) {
//     const sheetData = JSON.parse(
//       pako.inflate(workbookData.workbookData[sheetName], { to: 'string' }),
//     ).sheetCellData;

//     const columns = extractColumnNameIds(sheetData);
//     const COAs = extractCOAData(sheetData);
//     promiseQuery.push(
//       sheetNameRepository.findByName(sheetName).then(sheet => {
//         for (const row in COAs) {
//           for (const column in columns) {
//             const cellData = getCellData(sheetData, +row, +column);
//             masterValues.push({
//               submission: { _id: submission._id, name: submission.name },
//               sheet: { _id: sheet._id, name: sheetName },
//               org,
//               program,
//               template,
//               templateType,
//               reportingPeriod: submission.reportingPeriod,
//               AttributeId: columns[column],
//               CategoryId: COAs[row].COAId,
//               ...COAs[row],
//               value: cellData ? cellData.value : undefined,
//             });
//           }
//         }
//       }),
//     );
//   }
//   Promise.all(promiseQuery).then(() => {
//     masterValueRepository.bulkUpdate(id, masterValues);
//   });
// };


export async function populateWorkbook(templateData) {
  console.log("PopulateWorkbook")
  const resMasterValue = {};

  
  for (const sheetName in templateData.sheets){

    // For populating workbookData
    const attributeIds = [];
    const categoryIds = [];
    
    const sheetData = templateData.sheets[sheetName];

    const columns = extractColumnNameIds(sheetData);
    const COAs = extractCOAData(sheetData);

    console.log(columns, COAs);
    for (const row in COAs) {
      categoryIds.push(COAs[row]);
    }
    for (const column in columns) {
      attributeIds.push(columns[column]);
    }
    console.log(attributeIds, categoryIds);
    let res = await masterValueRepository.batchFind(attributeIds, categoryIds)
    console.log(res)
    let test = [];
    for (const item in res) {
      const masterValueItem = res[item]
      console.log('Mastervalue ', masterValueItem)
      for (const row in COAs) {
        console.log("COA", COAs[row])
        if (COAs[row] === masterValueItem.CategoryId){
          for (const column in columns) {
            console.log("Column", columns[column])
            if (columns[column] === masterValueItem.AttributeId){
              test.push({ row: +row, column: +column, value: masterValueItem.value })
            }
          }
        }
      }
    }
    resMasterValue[sheetName] = test;
    console.log(resMasterValue);
  }

  return resMasterValue;

}

