const UNMERGE_CELLS = state => {
  const newState = { ...state };

  const {
    stagnantSelectionAreas,
    activeCellPosition: { x, y },
    sheetCellData,
  } = newState;

  if (
    stagnantSelectionAreas.length > 1 ||
    !sheetCellData[y] ||
    !sheetCellData[y][x] ||
    !sheetCellData[y][x].merged
  )
    return state;

  const { x1, y1, x2, y2 } = sheetCellData[y][x].merged;

  const newSheetCellData = { ...sheetCellData };

  const topLeftStyles = sheetCellData[y][x].styles;

  for (let row = y1; row <= y2; row++) {
    newSheetCellData[row] = { ...newSheetCellData[row] };

    for (let column = x1; column <= x2; column++) {
      newSheetCellData[row][column] = {
        ...newSheetCellData[row][column],
        styles: topLeftStyles ? { ...topLeftStyles } : undefined,
        merged: undefined,
      };
    }
  }

  newState.sheetCellData = newSheetCellData;

  return newState;
};

export default UNMERGE_CELLS;
