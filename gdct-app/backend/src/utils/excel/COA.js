import pako from 'pako';
import Container from 'typedi';
import SheetNameRepository from '../../repositories/SheetName';
import MasterValueRepository from '../../repositories/MasterValue';

const sheetNameRepository = Container.get(SheetNameRepository);
const masterValueRepository = Container.get(MasterValueRepository);

const getCellData = (sheetData, rowIndex, columnIndex) =>
  sheetData[rowIndex] ? sheetData[rowIndex][columnIndex] : undefined;

/**
 * Maps column with `Column` - which represents the column header
 */
export const extractColumnNameIds = sheetData => {
  const columns = {};
  const firstRow = sheetData[1];

  if (firstRow) {
    for (const column in firstRow) {
      const columnNumber = +column;

      if (columnNumber > 1) {
        const categoryData = getCellData(sheetData, 1, columnNumber);

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
export const extractCOAData = sheetData => {
  const COAs = {};

  for (const row in sheetData) {
    const rowNumber = +row;

    if (rowNumber > 1) {
      const COAIdData = getCellData(sheetData, rowNumber, 1);
      const COATreeIdData = getCellData(sheetData, rowNumber, 2);

      // ? Could be possible that COATreeId is not needed, ie no grouping
      if (COAIdData && COAIdData.value) {
        COAs[row] = {
          COAId: COAIdData.value,
          COATreeId: COATreeIdData ? COATreeIdData.value : undefined,
        };
      }
    }
  }

  return COAs;
};

export const extractCOAColumnPairs = sheetData => {
  const masterValueGroups = [];

  const columnIds = extractColumnNameIds(sheetData);
  const COAIds = extractCOAData(sheetData);

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
) => {
  const { workbookData } = submission;

  const masterValues = [];
  const promiseQuery = [];

  for (const sheetName in workbookData.workbookData) {
    const sheetData = JSON.parse(
      pako.inflate(workbookData.workbookData[sheetName], { to: 'string' }),
    ).sheetCellData;

    const columns = extractColumnNameIds(sheetData);
    const COAs = extractCOAData(sheetData);
    promiseQuery.push(
      sheetNameRepository.findByName(sheetName).then(sheet => {
        for (const row in COAs) {
          for (const column in columns) {
            const cellData = getCellData(sheetData, +row, +column);
            masterValues.push({
              submission: { _id: submission._id, name: submission.name },
              sheet: { _id: sheet._id, name: sheetName },
              org,
              program,
              template,
              templateType,
              reportingPeriod: submission.reportingPeriod,
              AttributeId: columns[column],
              CategoryId: COAs[row].COAId,
              ...COAs[row],
              value: cellData ? cellData.value : undefined,
            });
          }
        }
      }),
    );
  }
  Promise.all(promiseQuery).then(() => {
    masterValueRepository.bulkUpdate(id, masterValues);
  });
};
