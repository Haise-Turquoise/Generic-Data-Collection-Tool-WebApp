import {
  getInsertData,
  offsetObjectAtIndex,
  offsetSheetCellColumnDataAtIndex,
} from '../tools/offset';

const INSERT_COLUMN = state => {
  const {
    activeCellPosition,
    sheetCellData,
    sheetColumnWidths,
    sheetHiddenColumns,
    sheetColumnCount,
    stagnantSelectionAreas,
  } = state;

  const newState = { ...state };

  const { insertCount, insertStart } = getInsertData(
    'x',
    stagnantSelectionAreas,
    activeCellPosition,
  );

  newState.sheetColumnCount = sheetColumnCount + insertCount;

  newState.sheetCellData = offsetSheetCellColumnDataAtIndex(
    sheetCellData,
    insertStart,
    insertCount,
  );
  newState.sheetColumnWidths = offsetObjectAtIndex(sheetColumnWidths, insertStart, insertCount);
  newState.sheetHiddenColumns = offsetObjectAtIndex(sheetHiddenColumns, insertStart, insertCount);

  return newState;
};

export default INSERT_COLUMN;
