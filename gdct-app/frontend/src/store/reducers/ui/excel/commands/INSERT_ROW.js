import { getInsertData, offsetObjectAtIndex, offsetSheetCellRowDataAtIndex } from '../tools/offset';

const INSERT_ROW = state => {
  const {
    activeCellPosition,
    sheetCellData,
    sheetRowHeights,
    sheetHiddenRows,
    sheetRowCount,
    stagnantSelectionAreas,
  } = state;

  const newState = { ...state };

  const { insertCount, insertStart } = getInsertData(
    'y',
    stagnantSelectionAreas,
    activeCellPosition,
  );

  newState.sheetRowCount = sheetRowCount + insertCount;
  newState.sheetCellData = offsetSheetCellRowDataAtIndex(sheetCellData, insertStart, insertCount);
  newState.sheetRowHeights = offsetObjectAtIndex(sheetRowHeights, insertStart, insertCount);
  newState.sheetHiddenRows = offsetObjectAtIndex(sheetHiddenRows, insertStart, insertCount);

  return newState;
};

export default INSERT_ROW;
