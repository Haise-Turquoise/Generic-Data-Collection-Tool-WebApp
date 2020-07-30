import { getWholeArea } from '../tools/merge';
import { scrollTo } from '../tools/scroll';
import { isPositionEqualArea } from '../../../../../tools/excel';
import { updateActiveCellPosition } from '../tools/cell';

const ARROW_RIGHT = (state, { shiftKey }) => {
  const { isEditMode } = state;

  if (isEditMode) return state;

  let newState = { ...state };

  const {
    sheetCellData,
    sheetColumnCount,
    activeCellPosition,
    activeCellSelectionAreaIndex,
    stagnantSelectionAreas,
  } = newState;

  let { x, y } = activeCellPosition;

  newState.activeSelectionArea = null;

  const stagnantSelectionAreasLength = stagnantSelectionAreas.length;

  if (shiftKey) {
    if (stagnantSelectionAreasLength) {
      let focusedStagnantSelectionArea = {
        ...stagnantSelectionAreas[activeCellSelectionAreaIndex],
      };

      const { x1, y1, x2, y2 } = focusedStagnantSelectionArea;

      const minY = Math.min(y1, y2);
      const minX = Math.min(x1, x2);
      const maxY = Math.max(y1, y2);
      const maxX = Math.max(x1, x2);

      // Consider min vertical area of active cell
      const minArea = getWholeArea({
        minX: x,
        maxX: x,
        minY,
        maxY,
        sheetCellData,
      });

      // Shrink left
      if (minX < x && minArea.x1 !== minX) {
        const { x2: newMinX } = getWholeArea({
          minX,
          minY,
          maxX: minX,
          maxY,
          sheetCellData,
        });

        focusedStagnantSelectionArea = {
          x1: newMinX + 1,
          y1: minY,
          y2: maxY,
          x2: maxX,
        };

        scrollTo({
          newState,
          newY: x1 < x ? y1 : y2,
          newX: focusedStagnantSelectionArea.x1,
        });

        if (isPositionEqualArea(activeCellPosition, focusedStagnantSelectionArea)) {
          newState.stagnantSelectionAreas = [];
          newState.activeCellSelectionAreaIndex = -1;
        } else {
          newState.stagnantSelectionAreas = [focusedStagnantSelectionArea];
          newState.activeCellSelectionAreaIndex = 0;
        }
      } else {
        focusedStagnantSelectionArea = getWholeArea({
          minX,
          minY,
          maxX: maxX + 1,
          maxY,
          sheetCellData,
        });

        scrollTo({
          newState,
          newY: x1 > x ? y1 : y2,
          newX: focusedStagnantSelectionArea.x2,
        });

        if (
          focusedStagnantSelectionArea.x1 < sheetColumnCount &&
          focusedStagnantSelectionArea.x2 < sheetColumnCount
        ) {
          newState.stagnantSelectionAreas = [focusedStagnantSelectionArea];
          newState.activeCellSelectionAreaIndex = 0;
        }
      }
    } else {
      let x1;
      let x2;
      let y1;
      let y2;

      // Check if current cell is merged
      if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
        const { x1: mergedX1, x2: mergedX2, y1: mergedY1, y2: mergedY2 } = sheetCellData[y][
          x
        ].merged;
        x1 = mergedX1;
        x2 = mergedX2 + 1;
        y1 = mergedY1;
        y2 = mergedY2;
      } else {
        x1 = x;
        x2 = x + 1;
        y1 = y;
        y2 = y;
      }

      // Check for max area after movement
      const minArea = getWholeArea({
        minX: x1,
        minY: y1,
        maxX: x2,
        maxY: y2,
        sheetCellData,
      });

      if (x2 < sheetColumnCount) {
        newState.stagnantSelectionAreas = [minArea];
        newState.activeCellSelectionAreaIndex = 0;
        scrollTo({
          newState,
          newY: y,
          newX: minArea.x2,
        });
      } else {
        scrollTo({
          newState,
          newY: y,
          newX: x,
        });
      }
    }
  } else {
    if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
      const { merged } = sheetCellData[y][x];

      const { x2 } = merged;

      x = x2 + 1;
    } else {
      x++;
    }

    if (x < sheetColumnCount)
      newState = updateActiveCellPosition({
        newState,
        newY: y,
        newX: x,
      });
    newState.stagnantSelectionAreas = [];
    newState.activeCellSelectionAreaIndex = -1;
  }

  return newState;
};

export default ARROW_RIGHT;
