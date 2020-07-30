const ENABLE_EDIT_MODE = state => {
  const { activeCellPosition, activeCellDialog, sheetCellData } = state;

  const newState = { ...state };

  const { x, y } = activeCellPosition;

  if (
    (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].isReadOnly) ||
    activeCellDialog
  )
    return state;

  newState.isEditMode = false;
  newState.isSelectionMode = false;

  return newState;
};

export default ENABLE_EDIT_MODE;
