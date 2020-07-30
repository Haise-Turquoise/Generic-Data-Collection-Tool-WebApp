const SET_GROUPS = (state, { id, columnName, category, newGroups, selectedCOAIds, COAIds }) => {
  const {
    sheetCellData,
    activeCellPosition: { y, x },
  } = state;

  const newState = { ...state };

  const newSheetCellData = { ...sheetCellData };

  // ! TODO
  if (category === 'attribute') {
    newSheetCellData[1] = { ...newSheetCellData[1], [x]: { value: id } };
    newSheetCellData[8] = { ...newSheetCellData[8], [x]: { value: columnName } };
  } else {
    const group = newGroups[newGroups.length - 1];
    newSheetCellData[y] = { ...newSheetCellData[y] };

    newSheetCellData[y][3] = { value: group.value };
    let row = y + 1;

    for (const COAId of COAIds) {
      const { _id, name } = COAId;
      const isSelected = selectedCOAIds[_id];

      if (isSelected) {
        newSheetCellData[row] = { ...newSheetCellData[row] };
        newSheetCellData[row][1] = { value: _id };
        newSheetCellData[row][2] = { value: group._id };
        newSheetCellData[row][3] = { value: name };
        row++;
      }
    }
  }

  newState.sheetCellData = newSheetCellData;

  return newState;
};

export default SET_GROUPS;
