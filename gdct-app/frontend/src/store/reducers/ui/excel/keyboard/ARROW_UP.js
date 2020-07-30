import { getWholeArea } from '../tools/merge';
import { scrollTo } from '../tools/scroll';
import { isPositionEqualArea } from '../../../../../tools/excel';
import { updateActiveCellPosition } from '../tools/cell';

const ARROW_UP = (state, { shiftKey }) => {
  const { isEditMode } = state;

  if (isEditMode) return state;

  let newState = { ...state };

  const {
    sheetCellData,
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

      // Consider min horizontal area of active cell
      const minArea = getWholeArea({
        minX,
        maxX,
        minY: y,
        maxY: y,
        sheetCellData,
      });

      // Shrink bottom
      if (maxY > y && minArea.y2 !== maxY) {
        // Consider merged cells
        const { y1: newMaxY } = getWholeArea({
          minX,
          minY: maxY,
          maxX,
          maxY,
          sheetCellData,
        });

        focusedStagnantSelectionArea = {
          x1: minX,
          y1: minY,
          x2: maxX,
          y2: newMaxY - 1,
        };

        scrollTo({
          newState,
          newY: focusedStagnantSelectionArea.y2,
          newX: y1 > y ? x1 : x2,
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
          minY: minY - 1,
          maxX,
          maxY,
          sheetCellData,
        });

        scrollTo({
          newState,
          newY: focusedStagnantSelectionArea.y1,
          newX: y1 < y ? x1 : x2,
        });

        if (focusedStagnantSelectionArea.y1 > 0 && focusedStagnantSelectionArea.y2 > 0) {
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
        x2 = mergedX2;
        y1 = mergedY1 - 1;
        y2 = mergedY2;
      } else {
        x1 = x;
        x2 = x;
        y1 = y - 1;
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

      if (y1 > 0) {
        newState.stagnantSelectionAreas = [minArea];
        newState.activeCellSelectionAreaIndex = 0;
        scrollTo({
          newState,
          newY: minArea.y1,
          newX: x,
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
    // Check if current cell is a merge cell. Move to the next cell down (which is not merged with current)
    if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
      const { merged } = sheetCellData[y][x];

      const { y1 } = merged;

      y = y1 - 1;
    } else {
      y--;
    }

    if (y > 0)
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

export default ARROW_UP;
