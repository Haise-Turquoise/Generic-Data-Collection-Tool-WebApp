import { getWholeArea } from '../tools/merge';

const SELECT_OVER = (state, { newX2, newY2, ctrlKey }) => {
  const { sheetCellData, isSelectionMode, activeCellPosition, stagnantSelectionAreas } = state;

  if (!isSelectionMode) return state;

  const newState = { ...state };

  if (!ctrlKey) newState.stagnantSelectionAreas = [];

  const { x, y } = activeCellPosition;

  if (x === newX2 && y === newY2 && !ctrlKey) {
    newState.activeSelectionArea = null;
    newState.activeSelectionAreaIndex = -1;
  } else {
    newState.activeSelectionArea = getWholeArea({
      minY: Math.min(y, newY2),
      minX: Math.min(x, newX2),
      maxY: Math.max(y, newY2),
      maxX: Math.max(x, newX2),
      sheetCellData,
    });

    newState.activeCellSelectionAreaIndex = stagnantSelectionAreas.length;
  }

  return newState;
};

export default SELECT_OVER;
