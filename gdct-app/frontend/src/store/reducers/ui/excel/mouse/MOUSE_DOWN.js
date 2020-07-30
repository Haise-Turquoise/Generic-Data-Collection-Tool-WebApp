import { getWholeArea } from '../tools/merge';
import { updateActiveCellPosition, saveActiveCellInputData } from '../tools/cell';

const MOUSE_DOWN = (state, { x1, y1, ctrlKey, shiftKey }) => {
  const { sheetCellData, activeCellPosition, stagnantSelectionAreas } = state;

  let newState = { ...state };

  const { x, y } = activeCellPosition;

  const stagnantSelectionAreasLength = stagnantSelectionAreas.length;

  if ((!ctrlKey && stagnantSelectionAreasLength) || shiftKey) newState.stagnantSelectionAreas = [];

  newState = saveActiveCellInputData({ newState });

  newState.isSelectionMode = true;

  if (ctrlKey || shiftKey) {
    let x2;
    let y2;

    if (shiftKey) {
      const minY = Math.min(y1, y);
      const minX = Math.min(x1, x);
      const maxY = Math.max(y1, y);
      const maxX = Math.max(x1, x);

      const newArea = getWholeArea({ minX, minY, maxX, maxY, sheetCellData });

      x1 = newArea.x1;
      y1 = newArea.y1;
      x2 = newArea.x2;
      y2 = newArea.y2;

      newState.newActiveCellSelectionAreaIndex = 0;
    } else {
      if (sheetCellData[y1] && sheetCellData[y1][x1] && sheetCellData[y1][x1].merged) {
        const { x2: mergedX2, y2: mergedY2 } = sheetCellData[y1][x1].merged;
        x2 = mergedX2;
        y2 = mergedY2;
      } else {
        y2 = y1;
        x2 = x1;
      }

      newState.newActiveCellSelectionAreaIndex = stagnantSelectionAreasLength + 1;

      if (!stagnantSelectionAreasLength && (x1 !== x || y1 !== y)) {
        let oldX2;
        let oldY2;
        if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
          const { x2: mergedX2, y2: mergedY2 } = sheetCellData[y][x].merged;
          oldX2 = mergedX2;
          oldY2 = mergedY2;
        } else {
          oldY2 = y;
          oldX2 = x;
        }

        newState.stagnantSelectionAreas = [{ x1: x, y1: y, x2: oldX2, y2: oldY2 }];
      }

      newState = updateActiveCellPosition({
        newState,
        newY: y1,
        newX: x1,
        shouldScroll: false,
      });
    }

    newState.activeSelectionArea = { x1, y1, x2, y2 };
  } else {
    newState = updateActiveCellPosition({
      newState,
      newX: x1,
      newY: y1,
      shouldScroll: false,
    });
  }

  return newState;
};

export default MOUSE_DOWN;
