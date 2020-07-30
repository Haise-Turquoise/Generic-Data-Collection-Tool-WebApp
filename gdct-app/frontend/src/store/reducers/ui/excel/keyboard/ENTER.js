import { saveActiveCellInputData, updateActiveCellPosition } from '../tools/cell';
import { getEnterFreeSpot, getShiftEnterFreeSpot, getMergedData } from '../tools/merge';

const ENTER = (state, { shiftKey }) => {
  let {
    isEditMode,

    activeCellSelectionAreaIndex,
    activeCellPosition,
    activeSelectionArea,
    stagnantSelectionAreas,

    sheetCellData,
    sheetRowCount,
    sheetColumnCount,
  } = state;

  let newState = { ...state };

  let { x, y } = activeCellPosition;

  if (isEditMode) {
    newState = saveActiveCellInputData({ newState });

    window.sheetContainerRef.current.focus();
  } else if (!isEditMode && activeCellSelectionAreaIndex === -1) {
    newState.isEditMode = true;

    return newState;
  }

  let selectionArea;
  let isBounded;

  let x1;
  let y1;
  let x2;
  let y2;

  const stagnantSelectionAreasLength = stagnantSelectionAreas.length;

  // Get the rectangular scope that an active selection area can go in
  // TODO : clean up later
  if (activeSelectionArea || stagnantSelectionAreasLength) {
    isBounded = false;

    if (activeSelectionArea) {
      // It is possible to have the active cell go over both active area and stagnant areas
      if (stagnantSelectionAreasLength) {
        // ! Make the first upper outer bound be the indicator that the active cell is in the acive selection area
        // ! When it's not out of bound, the cell is in a stagnant selection area
        if (stagnantSelectionAreasLength === activeCellSelectionAreaIndex) {
          selectionArea = activeSelectionArea;
        } else {
          selectionArea = stagnantSelectionAreas[activeCellSelectionAreaIndex];
        }
      } else {
        selectionArea = activeSelectionArea;
      }
    } else {
      selectionArea = stagnantSelectionAreas[activeCellSelectionAreaIndex];
    }

    x1 = selectionArea.x1;
    y1 = selectionArea.y1;
    x2 = selectionArea.x2;
    y2 = selectionArea.y2;
  } else {
    isBounded = true;

    x1 = 1;
    y1 = 1;
    x2 = sheetColumnCount - 1;
    y2 = sheetRowCount - 1;
  }

  const startY = Math.min(y1, y2);
  const endY = Math.max(y1, y2);
  const startX = Math.min(x1, x2);
  const endX = Math.max(x1, x2);

  const merged = getMergedData(sheetCellData, y, x);

  if (shiftKey) {
    if (merged) {
      const { y1 } = merged;
      y = y1 - 1;
    } else {
      y--;
    }
  } else if (stagnantSelectionAreas.length) {
    for (let row = y + 1; row <= endY; row++) {
      const rowData = sheetCellData[row];

      if (rowData && rowData[x] && rowData[x].merged) {
        const { x1: mergedX1, y1: mergedY1, y2: mergedY2 } = rowData[x].merged;

        if (mergedY1 === row && mergedX1 === x) {
          y = row - 1;
          break;
        } else {
          y = mergedY2;
        }
      } else {
        y = row - 1;
        break;
      }
    }

    y++;
  } else if (merged) {
    const { y2 } = merged;
    y = y2 + 1;
  } else {
    y++;
  }

  // Check for bounds -- do not update when isbounded and tab goes out bounds
  if (y < startY || y > endY) {
    if (!isBounded) {
      if (shiftKey) {
        x--;

        if (x >= startX) {
          const { maxX, maxY } = getShiftEnterFreeSpot({
            x,
            startY,
            endY,
            sheetCellData,
          });

          x = maxX;
          y = maxY;
        }
      } else {
        x++;

        if (x <= endX) {
          const { minX, minY } = getEnterFreeSpot({
            x,
            startY,
            endY,
            sheetCellData,
          });

          x = minX;
          y = minY;
        }
      }

      // Check for bounds in x
      if (x < startX || x > endX) {
        // Need to switch selection areas.
        x < startX ? activeCellSelectionAreaIndex-- : activeCellSelectionAreaIndex++;

        // Fix out of bounds result
        if (
          (activeSelectionArea &&
            activeCellSelectionAreaIndex === stagnantSelectionAreasLength + 1) ||
          (!activeSelectionArea && activeCellSelectionAreaIndex === stagnantSelectionAreasLength)
        ) {
          activeCellSelectionAreaIndex = 0;
        } else if (activeCellSelectionAreaIndex < 0) {
          activeSelectionArea
            ? (activeCellSelectionAreaIndex = stagnantSelectionAreasLength)
            : (activeCellSelectionAreaIndex = stagnantSelectionAreasLength - 1);
        }

        const newSelectionArea =
          activeCellSelectionAreaIndex === stagnantSelectionAreasLength
            ? activeSelectionArea
            : stagnantSelectionAreas[activeCellSelectionAreaIndex];

        const { x1: newX1, y1: newY1, x2: newX2, y2: newY2 } = newSelectionArea;

        if (x < startX) {
          x = Math.max(newX1, newX2);
          y = Math.max(newY1, newY2);

          const { maxX, maxY } = getShiftEnterFreeSpot({
            x,
            startY: Math.min(newY1, newY2),
            endY: Math.max(newY1, newY2),
            sheetCellData,
          });

          if (maxX > 0 && maxY > 0) {
            x = maxX;
            y = maxY;
          }
        } else {
          x = Math.min(newX1, newX2);
          y = Math.min(newY1, newY2);
        }

        newState.activeCellSelectionAreaIndex = activeCellSelectionAreaIndex;
      }

      newState = updateActiveCellPosition({
        newState,
        newY: y,
        newX: x,
      });
    }
  } else {
    if (stagnantSelectionAreas.length) {
      if (shiftKey) {
        // Check if there's free space at x (before y since shift)
        const { maxX: currentMaxX, maxY: currentMaxY } = getShiftEnterFreeSpot({
          x,
          endY: y,
          startY,
          sheetCellData,
        });

        // Found a merged cell - not supposed to go here
        if (currentMaxX !== x) {
          x--;

          const { maxX, maxY } = getShiftEnterFreeSpot({
            endY,
            startY,
            x,
            sheetCellData,
          });

          x = maxX;
          y = maxY;
        } else {
          x = currentMaxX;
          y = currentMaxY;
        }
      }
    }

    newState = updateActiveCellPosition({
      newState,
      newY: y,
      newX: x,
    });
  }

  return newState;
};

export default ENTER;
