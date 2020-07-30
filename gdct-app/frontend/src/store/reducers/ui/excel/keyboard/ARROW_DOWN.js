import { getWholeArea } from '../tools/merge';
import { scrollTo } from '../tools/scroll';
import { isPositionEqualArea } from '../../../../../tools/excel';
import { updateActiveCellPosition } from '../tools/cell';

const ARROW_DOWN = (state, { shiftKey }) => {
  const { isEditMode } = state;

  if (isEditMode) return state;

  let newState = { ...state };

  const {
    sheetRowCount,
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

      // Shrink top
      if (minY < y && minArea.y1 !== minY) {
        // Get horizontal min area of above to check for merged cells
        const { y2: newMinY } = getWholeArea({
          minX,
          minY,
          maxX,
          maxY: minY,
          sheetCellData,
        });

        focusedStagnantSelectionArea = {
          x1: minX,
          y1: newMinY + 1,
          x2: maxX,
          y2: maxY,
        };

        scrollTo({
          newState,
          newY: focusedStagnantSelectionArea.y1,
          newX: y1 < y ? x1 : x2,
        });

        // Remove scroll above.. then get min area to get combined merged and normal cell

        if (isPositionEqualArea(activeCellPosition, focusedStagnantSelectionArea)) {
          newState.stagnantSelectionAreas = [];
          newState.activeCellSelectionAreaIndex = -1;
        } else {
          newState.stagnantSelectionAreas = [focusedStagnantSelectionArea];
          newState.activeCellSelectionAreaIndex = 0;
        }
        // Expand bottom
      } else {
        focusedStagnantSelectionArea = getWholeArea({
          minY,
          minX,
          maxX,
          maxY: maxY + 1,
          sheetCellData,
        });

        scrollTo({
          newState,
          newY: focusedStagnantSelectionArea.y2,
          newX: y1 < y ? x2 : x1,
        });

        if (
          focusedStagnantSelectionArea.y1 < sheetRowCount &&
          focusedStagnantSelectionArea.y2 < sheetRowCount
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
        x2 = mergedX2;
        y1 = mergedY1;
        y2 = mergedY2 + 1;
      } else {
        x1 = x;
        x2 = x;
        y1 = y;
        y2 = y + 1;
      }

      // Check for max area after movement
      const minArea = getWholeArea({
        minX: x1,
        minY: y1,
        maxX: x2,
        maxY: y2,
        sheetCellData,
      });

      if (y2 < sheetRowCount) {
        newState.stagnantSelectionAreas = [minArea];
        newState.activeCellSelectionAreaIndex = 0;
        scrollTo({
          newState,
          newY: minArea.y2,
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
    if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
      const { merged } = sheetCellData[y][x];

      const { y2 } = merged;

      y = y2 + 1;
    } else {
      y++;
    }

    if (y < sheetRowCount)
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

export default ARROW_DOWN;
