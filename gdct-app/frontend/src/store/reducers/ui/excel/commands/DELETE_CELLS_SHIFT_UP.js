import { getLastArea } from '../tools/area';

const DELETE_CELLS_SHIFT_UP = state => {
  const { stagnantSelectionAreas, activeCellPosition, sheetCellData } = state;

  const newState = { ...state };

  const { y1, y2, x1, x2 } = getLastArea(stagnantSelectionAreas, activeCellPosition);

  const shiftOffsetY = Math.abs(y1 - y2);
  const shiftStartY = Math.min(y1, y2);
  const shiftEndY = shiftStartY + shiftOffsetY + 1;

  const columnStart = Math.min(x1, x2);
  const columnEnd = Math.max(x1, x2);

  const newSheetCellData = {};

  for (const row in sheetCellData) {
    const columns = sheetCellData[row];

    if (row < shiftStartY) {
      newSheetCellData[row] = columns;
    } else {
      for (const column in columns) {
        if (row >= shiftEndY && column >= columnStart && column <= columnEnd) {
          const newRowOffset = row - shiftOffsetY - 1;
          newSheetCellData[newRowOffset] = {
            ...sheetCellData[newRowOffset],
            [column]: sheetCellData[row][column],
          };
        } else if (column < columnStart || column > columnEnd) {
          newSheetCellData[row] = {
            ...sheetCellData[row],
            [column]: sheetCellData[row][column],
          };
        }
      }
    }
  }

  newState.sheetCellData = newSheetCellData;

  return newState;
};

export default DELETE_CELLS_SHIFT_UP;
