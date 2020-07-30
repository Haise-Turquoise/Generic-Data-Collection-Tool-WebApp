const SET_BUSINESS_CONCEPT = (state, { category, concept }) => {
  const newState = { ...state };

  const { activeCellPosition, sheetCellData } = newState;

  const { x, y } = activeCellPosition;

  const newSheetCellData = { ...sheetCellData };

  if (category === 'attribute') {
    if (!newSheetCellData[1]) newSheetCellData[1] = {};

    newSheetCellData[1][x] = { value: concept, type: 'normal' };
  } else {
    if (!newSheetCellData[y]) newSheetCellData[y] = {};

    // ! Should we remove everything?
    newSheetCellData[y][1] = {
      ...newSheetCellData[y][1],
      value: concept,
      type: 'normal',
    };
  }

  newState.sheetCellData = newSheetCellData;

  return newState;
};

export default SET_BUSINESS_CONCEPT;
