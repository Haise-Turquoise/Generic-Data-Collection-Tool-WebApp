import uniqid from 'uniqid';

const ADD_COMMENT = (state, { comment, accountId, firstName, lastName }) => {
  const newState = { ...state };

  const { sheetCellData, activeCellPosition } = newState;

  const newSheetCellData = { ...sheetCellData };

  const { x, y } = activeCellPosition;

  if (!newSheetCellData[y]) newSheetCellData[y] = {};

  if (!newSheetCellData[y][x]) newSheetCellData[y][x] = {};

  if (!newSheetCellData[y][x].comments) newSheetCellData[y][x].comments = [];

  const commentData = {
    id: uniqid(),
    by: `${firstName} ${lastName}`,
    accountId,
    comment,
  };

  newSheetCellData[y][x].comments.push(commentData);

  newState.sheetCellData = newSheetCellData;

  return newState;
};

export default ADD_COMMENT;
