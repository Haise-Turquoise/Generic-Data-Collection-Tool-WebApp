const MERGE_CELLS = state => {
  const newState = { ...state };

  const { stagnantSelectionAreas, sheetCellData } = newState;

  // Can only merge when there's only one area
  if (stagnantSelectionAreas.length !== 1) return state;

  const { x1, y1, x2, y2 } = stagnantSelectionAreas[0];

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  const newSheetCellData = { ...sheetCellData };

  for (let row = minY; row <= maxY; row++) {
    newSheetCellData[row] = { ...newSheetCellData[row] };

    const rowData = newSheetCellData[row];

    for (let column = minX; column <= maxX; column++) {
      const merged = { x1: minX, y1: minY, x2: maxX, y2: maxY };

      if (row === minY && column === minX) {
        rowData[column] = { ...rowData[column], merged };
      } else {
        rowData[column] = { merged };
      }
    }
  }

  newState.sheetCellData = newSheetCellData;
  newState.stagnantSelectionAreas = [];

  return newState;
};

export default MERGE_CELLS;
