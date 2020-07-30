import { isObjectEmpty } from '../../../../../tools/misc';

const DELETE_COMMENT = (state, { commentId, _accountId }) => {
  const newState = { ...state };

  const { sheetCellData, activeCellPosition } = newState;

  const newSheetCellData = { ...sheetCellData };

  const { x, y } = activeCellPosition;

  if (newSheetCellData[y] && newSheetCellData[y][x]) {
    const { comments } = newSheetCellData[y][x];

    if (comments) {
      const commentIndex = comments.findIndex(({ id }) => id === commentId);

      if (commentIndex >= 0) {
        newSheetCellData[y][x].comments = [
          ...comments.slice(0, commentIndex),
          ...comments.slice(commentIndex + 1),
        ];
        // ! Need to make a function for this... tedious
        if (!newSheetCellData[y][x].comments.length) delete newSheetCellData[y][x].comments;
        if (isObjectEmpty(newSheetCellData[y][x])) delete newSheetCellData[y][x];
        if (isObjectEmpty(newSheetCellData[y])) delete newSheetCellData[y];

        newState.sheetCellData = newSheetCellData;
      }
    }
  } else {
    console.error('Comment not found');
  }

  return newState;
};

export default DELETE_COMMENT;
