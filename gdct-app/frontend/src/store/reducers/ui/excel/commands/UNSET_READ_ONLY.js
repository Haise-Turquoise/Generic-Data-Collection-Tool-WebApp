import { isObjectEmpty } from '../../../../../tools/misc';

const UNSET_READ_ONLY = state => {
  const newState = { ...state };
  const { sheetCellData, stagnantSelectionAreas, activeCellPosition } = newState;

  const stagnantSelectionAreasLength = stagnantSelectionAreas.length;

  const newSheetCellData = { ...sheetCellData };

  if (stagnantSelectionAreasLength) {
    const areaPositionSet = {};

    stagnantSelectionAreas.forEach(({ x1, x2, y1, y2 }) => {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);

      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      for (let row = minY; row <= maxY; row++) {
        if (!areaPositionSet[row]) areaPositionSet[row] = {};

        for (let column = minX; column <= maxX; column++) areaPositionSet[row][column] = true;
      }
    });

    for (const row in areaPositionSet) {
      const columns = areaPositionSet[row];

      if (!newSheetCellData[row]) continue;

      for (const column in columns) {
        if (newSheetCellData[row][column]) {
          delete newSheetCellData[row][column].isReadOnly;

          if (isObjectEmpty(newSheetCellData[row][column])) {
            delete newSheetCellData[row][column];

            if (isObjectEmpty(newSheetCellData[row])) delete newSheetCellData[row];
          }
        }
      }
    }
  } else {
    const { x, y } = activeCellPosition;

    if (newSheetCellData[y]) {
      if (newSheetCellData[y][x]) {
        delete newSheetCellData[y][x].isReadOnly;

        if (isObjectEmpty(newSheetCellData[y][x])) {
          delete newSheetCellData[y][x];

          if (isObjectEmpty(newSheetCellData[y])) delete newSheetCellData[y];
        }
      }
    }
  }

  newState.sheetCellData = newSheetCellData;

  return newState;
};

export default UNSET_READ_ONLY;
